const jwt = require('jsonwebtoken');
const ResponseFactory = require('../helpers/ResponseFactory');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseFactory.unauthorized(res, 'Token não fornecido');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return ResponseFactory.unauthorized(res, 'Token inválido ou expirado');
  }
}

module.exports = authMiddleware;
