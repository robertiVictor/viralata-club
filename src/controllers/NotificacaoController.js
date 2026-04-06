const NotificacaoService = require('../services/NotificacaoService');
const NotificacaoRepository = require('../repositories/NotificacaoRepository');
const ResponseFactory = require('../helpers/ResponseFactory');

const notificacaoService = new NotificacaoService(new NotificacaoRepository());

class NotificacaoController {
  async listar(req, res, next) {
    try {
      const notificacoes = await notificacaoService.listarPorAdmin(req.user.id);
      return ResponseFactory.success(res, notificacoes);
    } catch (err) {
      next(err);
    }
  }

  async marcarComoLida(req, res, next) {
    try {
      const notificacao = await notificacaoService.marcarComoLida(req.params.id);
      return ResponseFactory.success(res, notificacao, 'Notificação marcada como lida');
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      next(err);
    }
  }
}

module.exports = NotificacaoController;
