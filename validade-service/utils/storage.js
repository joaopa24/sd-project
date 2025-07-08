const fs = require('fs');
const path = require('path');

const caminhoArquivo = path.join(__dirname, '../produtos.json');

function salvarProdutos(produtos) {
  fs.writeFileSync(caminhoArquivo, JSON.stringify(produtos, null, 2));
}

function carregarProdutos() {
  if (fs.existsSync(caminhoArquivo)) {
    const data = fs.readFileSync(caminhoArquivo);
    return JSON.parse(data);
  }
  return [];
}

module.exports = { salvarProdutos, carregarProdutos };
