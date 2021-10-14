const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi informado!
  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' });

  // Verificar se o token está no formato certo
  const parts = authHeader.split(' ');
  // Verificar se o token tem 2 partes 'barer' e o 'token'
  if (!parts.length === 2)
    return res.status(401).send({ error: 'Token error' });
  // Desestruturar e pegar as partes em variavel
  const [scheme, token ] = parts;
  // Verificar se no scheme está escrito barer (se começar com bearer regex)
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted'});

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    req.userId = decoded.id;
    return next();
  });

};