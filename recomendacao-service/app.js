const express = require('express');
const axios = require('axios');
const autenticarToken = require('./authMiddleware');
const app = express();
app.use(express.json());

app.post('/sugestao', autenticarToken ,async (req, res) => {
  try {
    // Buscar produtos com avaliação no endpoint /alertas do Validation Agent
    const response = await axios.get('http://validade-service:5000/alertas');
    const produtosComAvaliacoes = response.data;

    if (!Array.isArray(produtosComAvaliacoes) || produtosComAvaliacoes.length === 0) {
      return res.status(404).json({ erro: 'Nenhum produto encontrado no Validation Agent.' });
    }

    // Para cada produto + avaliação, gerar recomendação com LLM
    const promessas = produtosComAvaliacoes.map(({ produto, avaliacao }) =>
      gerarRecomendacaoSupermercado(produto, avaliacao)
    );
    const recomendacoes = await Promise.all(promessas);

    // Montar resposta com produto e recomendação
    const resultado = produtosComAvaliacoes.map(({ produto }, i) => ({
      produto,
      recomendacao: recomendacoes[i]
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});


app.listen(5001, () => {
  console.log('Recomendacao Agent rodando na porta 5001');
});
