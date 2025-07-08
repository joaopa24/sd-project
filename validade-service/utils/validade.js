function verificarValidade(produtos) {
  const hoje = new Date();
  return produtos.filter(produto => {
    const validade = new Date(produto.validade);
    const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 5;  // Vence em até 5 dias
  });
}

module.exports = { verificarValidade };
