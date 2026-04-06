const { validationResult } = require('express-validator');
const ResponseFactory = require('../helpers/ResponseFactory');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseFactory.error(res, 'Dados inválidos', 400, errors.array());
  }
  next();
}

module.exports = validate;
