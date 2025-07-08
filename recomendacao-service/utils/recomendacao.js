const axios = require('axios');

async function obterAvaliacaoRisco(produto) {
  try {
    // Supondo que o Validate Agent tenha um endpoint para avaliar um único produto
    const response = await axios.post('http://localhost:5000/avaliar', produto);
    return response.data.avaliacao; // texto com risco ALTO, MÉDIO, BAIXO
  } catch (error) {
    console.error('Erro ao obter avaliação do Validate Agent:', error.message);
    return 'Avaliação indisponível';
  }
}

async function gerarSugestaoMitral(produto) {
  const avaliacao = await obterAvaliacaoRisco(produto);

  if (avaliacao.includes('ALTO')) {
    return 'Descartar o produto imediatamente para evitar desperdício.';
  } else if (avaliacao.includes('MÉDIO')) {
    return 'Consumir o produto em breve para evitar perdas.';
  } else if (avaliacao.includes('BAIXO')) {
    return 'Produto dentro do prazo, sem urgência.';
  } else {
    return 'Sem recomendação específica.';
  }
}

module.exports = { gerarSugestaoMitral };
