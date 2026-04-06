const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const ResponseFactory = require('../helpers/ResponseFactory');

const userService = new UserService(new UserRepository());

class UserController {
  async listar(req, res, next) {
    try {
      const users = await userService.listarTodos();
      return ResponseFactory.success(res, users);
    } catch (err) {
      next(err);
    }
  }

  async bloquear(req, res, next) {
    try {
      const user = await userService.bloquear(req.params.id);
      const msg = user.bloqueado ? 'Usuário bloqueado' : 'Usuário desbloqueado';
      return ResponseFactory.success(res, user, msg);
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      next(err);
    }
  }

  async excluir(req, res, next) {
    try {
      await userService.excluir(req.params.id);
      return ResponseFactory.success(res, null, 'Usuário excluído com sucesso');
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      next(err);
    }
  }
}

module.exports = UserController;
