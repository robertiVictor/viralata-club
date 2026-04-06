const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');
const ResponseFactory = require('../helpers/ResponseFactory');

const authService = new AuthService(new UserRepository());

class AuthController {
  async register(req, res, next) {
    try {
      const { nome, email, senha, telefone } = req.body;
      const user = await authService.register({ nome, email, senha, telefone });
      return ResponseFactory.created(res, user, 'Usuário criado com sucesso');
    } catch (err) {
      if (err.statusCode === 409) {
        return ResponseFactory.conflict(res, err.message);
      }
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.login({ email, senha });
      return ResponseFactory.success(res, resultado, 'Login realizado com sucesso');
    } catch (err) {
      if (err.statusCode === 401) {
        return ResponseFactory.unauthorized(res, err.message);
      }
      if (err.statusCode === 403) {
        return ResponseFactory.forbidden(res, err.message);
      }
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id);
      return ResponseFactory.success(res, user);
    } catch (err) {
      if (err.statusCode === 404) {
        return ResponseFactory.notFound(res, err.message);
      }
      next(err);
    }
  }
}

module.exports = AuthController;
