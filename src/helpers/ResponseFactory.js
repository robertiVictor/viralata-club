class ResponseFactory {
  static success(res, data, message = 'Sucesso', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Erro interno', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static created(res, data, message = 'Recurso criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  static notFound(res, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  static conflict(res, message = 'Conflito') {
    return this.error(res, message, 409);
  }
}

module.exports = ResponseFactory;
