// authMiddleware.js
const jwt = require('jsonwebtoken');

const secret = "teste";

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Ex: 'Bearer tokenAqui'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = user; // opcional: dados decodificados do token
    next();
  });
}

module.exports = autenticarToken;
