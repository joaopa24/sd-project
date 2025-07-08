const express = require('express');
const { salvarProdutos, carregarProdutos } = require('./utils/storage');
const axios = require('axios');

const app = express();
app.use(express.json());

let produtos = carregarProdutos();

const OLLAMA_URL = 'http://localhost:11434/llm/predict'; // Exemplo URL padrão do Ollama HTTP API

async function avaliarRiscoLLM(produto) {
  const prompt = `Você é um assistente que avalia risco de desperdício de alimentos baseado no nome e data de validade.  
Produto: ${produto.nome}  
Data de validade: ${produto.validade}  
Classifique o risco como ALTO, MÉDIO ou BAIXO e explique resumidamente.`;

  try {
    // A API do Ollama espera JSON com "model" e "prompt"
    const response = await axios.post(OLLAMA_URL, {
      model: 'gpt4o-mini', // ajuste para seu modelo disponível no Ollama
      prompt: prompt,
      // outras opções se necessário
    });

    // A resposta do Ollama vem geralmente no campo 'completion' (verifique seu endpoint)
    const texto = response.data.completion || 'Resposta inválida';
    return texto;

  } catch (err) {
    console.error('Erro Ollama:', err.message);
    return 'Erro ao avaliar risco';
  }
}

app.post('/produtos', (req, res) => {
  produtos.push(req.body);
  salvarProdutos(produtos);
  res.json({ message: 'Produto cadastrado com sucesso.' });
});

app.get('/alertas', async (req, res) => {
  const alertas = [];

  for (const produto of produtos) {
    const avaliacao = await avaliarRiscoLLM(produto);
    alertas.push({
      produto,
      avaliacao
    });
  }

  res.json(alertas);
});

app.listen(5000, () => console.log('Validade Agent rodando na porta 5000'));
