const axios = require('axios');

async function gerarRecomendacaoSupermercado(produto, avaliacao) {
  const prompt = `
  Você é um especialista em gestão de estoque para supermercados focado em minimizar perdas.

  Produto: ${produto.nome}
  Validade: ${produto.validade}
  Avaliação detalhada: ${avaliacao.trim()}

  Orientações:
  - Produtos com validade inferior a 3 dias devem ser removidos da prateleira (promoção, descarte ou transferência).
  - Produtos com validade entre 3 e 5 dias devem ser transferidos para a área de promoção.
  - Produtos com mais de 5 dias de validade podem ser mantidos na prateleira.
  - Quantidades muito altas com validade curta podem exigir descarte ou ações mais rápidas.

  Com base nessa avaliação, informe qual ação o supermercado deve tomar para evitar perdas, escolhendo entre as opções:
  - "Criar promoção"
  - "Manter na prateleira"
  - "Transferir para área de promoção"
  - "Descarte imediato"
  - "Reavaliar estoque"

  Forneça a resposta como uma recomendação objetiva e curta. Exemplo: "Criar promoção", ou "Transferir para área de promoção".`;

  try {
    const response = await axios.post('http://host.docker.internal:11434/api/generate', {
      model: 'mistral',
      prompt: prompt,
      stream: false
    });
    return response.data.response.trim();
  } catch (error) {
    console.error('Erro ao gerar recomendação com LLM:', error.message);
    return 'Recomendação indisponível no momento.';
  }
}

module.exports = { gerarRecomendacaoSupermercado };