const axios = require('axios');

async function gerarSugestaoMitral(produto) {
  try {
    const response = await axios.post('https://api.mitral.ai/v1/completions', {
      prompt: `Sugira o que fazer com o produto ${produto.nome} que vence em breve.`,
      // Insira aqui os parâmetros reais da API da Mitral
    }, {
      headers: {
        'Authorization': 'Bearer SEU_TOKEN_DA_MITRAL_AQUI',
        'Content-Type': 'application/json',
      }
    });

    return response.data.suggestion;  // Ajuste conforme a resposta da API da Mitral
  } catch (error) {
    console.error('Erro ao acessar API da Mitral:', error.message);
    return 'Não foi possível gerar sugestão.';
  }
}

module.exports = { gerarSugestaoMitral };
