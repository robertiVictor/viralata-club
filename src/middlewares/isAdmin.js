const ResponseFactory = require('../helpers/ResponseFactory');

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return ResponseFactory.forbidden(res, 'Apenas administradores podem realizar esta ação');
  }
  next();
}

module.exports = isAdmin;
