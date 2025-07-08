const express = require('express');
const { salvarProdutos, carregarProdutos } = require('./utils/storage');
const axios = require('axios');

const app = express();
app.use(express.json());

let produtos = carregarProdutos();

const OLLAMA_URL = 'http://localhost:11434/llm/predict'; // URL do Ollama local

async function avaliarRiscoLLM(produto) {
  const prompt = `Você é um assistente que avalia risco de desperdício de alimentos baseado no nome e data de validade.  
Produto: ${produto.nome}  
Data de validade: ${produto.validade}  
Classifique o risco como ALTO, MÉDIO ou BAIXO e explique resumidamente.`;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: 'gpt4o-mini', // ajuste conforme modelo local
      prompt: prompt,
    });

    const texto = response.data.completion || 'Resposta inválida';
    return texto;
  } catch (err) {
    console.error('Erro Ollama:', err.message);
    return 'Erro ao avaliar risco';
  }
}

// Endpoint para cadastro do produto
app.post('/produtos', (req, res) => {
  const produto = req.body;
  if (!produto.nome || !produto.validade) {
    return res.status(400).json({ error: 'Campos nome e validade são obrigatórios.' });
  }
  produtos.push(produto);
  salvarProdutos(produtos);
  res.json({ message: 'Produto cadastrado com sucesso.' });
});

// Endpoint para avaliar um único produto (para uso interno/external Recommendation Service)
app.post('/avaliar', async (req, res) => {
  const produto = req.body;
  if (!produto.nome || !produto.validade) {
    return res.status(400).json({ error: 'Campos nome e validade são obrigatórios.' });
  }
  const avaliacao = await avaliarRiscoLLM(produto);
  res.json({ avaliacao });
});

// Endpoint para retornar alertas de todos os produtos, avaliando em paralelo
app.get('/alertas', async (req, res) => {
  try {
    const avaliacoes = await Promise.all(
      produtos.map(async (produto) => {
        const avaliacao = await avaliarRiscoLLM(produto);
        return { produto, avaliacao };
      })
    );
    res.json(avaliacoes);
  } catch (err) {
    console.error('Erro ao gerar alertas:', err.message);
    res.status(500).json({ error: 'Erro ao gerar alertas' });
  }
});

app.listen(5000, () => console.log('Validade Agent rodando na porta 5000'));
