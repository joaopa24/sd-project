const express = require('express');
const app = express();

app.use(express.json());

// Rotas (exemplo simples)
app.get('/', (req, res) => {
  res.send('API de Validade de Produtos');
});

module.exports = app;
