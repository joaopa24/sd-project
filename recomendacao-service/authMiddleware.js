const jwt = require('jsonwebtoken');
const secret = 'teste';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Pega só o token após "Bearer"

  if (!token) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error.message);
    return res.status(403).json({ error: 'Token inválido', details: error.message });
  }
}

module.exports = autenticarToken;
