const ResponseFactory = require('../helpers/ResponseFactory');

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.name === 'ValidationError') {
    return ResponseFactory.error(res, 'Dados inválidos', 400, err.details);
  }

  if (err.name === 'JsonWebTokenError') {
    return ResponseFactory.unauthorized(res, 'Token inválido');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseFactory.unauthorized(res, 'Token expirado');
  }

  return ResponseFactory.error(res, 'Erro interno do servidor', 500);
}

module.exports = errorHandler;
