const express = require('express');
const autenticarToken = require('./authMiddleware');
const { gerarRecomendacaoSupermercado } = require('./utils/recomendacao');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();
const secret = 'teste';

app.use(express.json());

app.post('/sugestao', autenticarToken, async (req, res) => {
  try {
    // Recuperar o token da requisição original
    let token = req.headers['authorization'] || '';
    token = token.replace(/^bearer /i, 'Bearer ');  // Garante prefixo correto

    // Buscar produtos com avaliação no endpoint /alertas do Validation Agent, enviando o token
    const response = await axios.get('http://validade-service:5000/alertas', {
      headers: {
        Authorization: token
      }
    });
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

app.post('/login', (req, res) => {
  // Aqui, validar credenciais (exemplo simples)
  const { username, password } = req.body;

  // Simulação de usuário fixo
  if (username === 'admin' && password === 'senha123') {
    const user = { name: username };
    const token = jwt.sign(user, secret, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Usuário ou senha inválidos' });
});

app.listen(5001, () => {
  console.log('Recomendacao Agent rodando na porta 5001');
});
