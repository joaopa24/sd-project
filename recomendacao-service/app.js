const express = require('express');
const { gerarSugestaoMitral } = require('./utils/recomendacao');
const app = express();
app.use(express.json());

app.post('/sugestao', async (req, res) => {
  const produto = req.body;
  const sugestao = await gerarSugestaoMitral(produto);
  res.json({ sugestao });
});

app.listen(5001, () => console.log('Recomendacao Agent rodando na porta 5001'));
