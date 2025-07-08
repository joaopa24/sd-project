const axios = require('axios');

async function gerarRecomendacaoSupermercado(produto, avaliacao) {
  const prompt = `
Você é um especialista em gestão de estoque para supermercados focado em minimizar perdas.

Produto: ${produto.nome}
Validade: ${produto.validade}
Avaliação detalhada: ${avaliacao.trim()}

Com base nessa avaliação, informe qual ação o supermercado deve tomar para evitar perdas, escolhendo entre as opções: "Criar promoção", "Manter na prateleira", "Transferir para área de promoção", "Descarte imediato" ou "Reavaliar estoque".

Forneça a resposta como uma recomendação objetiva e curta, por exemplo: "Criar promoção", ou "Manter na prateleira normalmente".
`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
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
