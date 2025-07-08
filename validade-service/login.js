// login.js ou direto no app.js
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  // Aqui, validar credenciais (exemplo simples)
  const { username, password } = req.body;

  // Simulação de usuário fixo
  if (username === 'admin' && password === 'senha123') {
    const user = { name: username };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Usuário ou senha inválidos' });
});
