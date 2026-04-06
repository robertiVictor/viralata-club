const AdocaoService = require('../services/AdocaoService');
const AdocaoRepository = require('../repositories/AdocaoRepository');
const PetRepository = require('../repositories/PetRepository');
const NotificacaoRepository = require('../repositories/NotificacaoRepository');
const ResponseFactory = require('../helpers/ResponseFactory');

const adocaoService = new AdocaoService(
  new AdocaoRepository(),
  new PetRepository(),
  new NotificacaoRepository()
);

class AdocaoController {
  async enviarInteresse(req, res, next) {
    try {
      const { pet_id, mensagem } = req.body;
      const adocao = await adocaoService.enviarInteresse({
        pet_id,
        adotante_id: req.user.id,
        mensagem,
      });
      return ResponseFactory.created(res, adocao, 'Interesse enviado com sucesso');
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      if (err.statusCode === 409) return ResponseFactory.conflict(res, err.message);
      next(err);
    }
  }

  async listarMinhas(req, res, next) {
    try {
      const adocoes = await adocaoService.listarMinhas(req.user.id);
      return ResponseFactory.success(res, adocoes);
    } catch (err) {
      next(err);
    }
  }

  async listarTodas(req, res, next) {
    try {
      const adocoes = await adocaoService.listarTodas();
      return ResponseFactory.success(res, adocoes);
    } catch (err) {
      next(err);
    }
  }

  async aprovar(req, res, next) {
    try {
      const adocao = await adocaoService.aprovar(req.params.id);
      return ResponseFactory.success(res, adocao, 'Adoção aprovada com sucesso');
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      if (err.statusCode === 409) return ResponseFactory.conflict(res, err.message);
      next(err);
    }
  }

  async rejeitar(req, res, next) {
    try {
      const adocao = await adocaoService.rejeitar(req.params.id);
      return ResponseFactory.success(res, adocao, 'Adoção rejeitada');
    } catch (err) {
      if (err.statusCode === 404) return ResponseFactory.notFound(res, err.message);
      if (err.statusCode === 409) return ResponseFactory.conflict(res, err.message);
      next(err);
    }
  }
}

module.exports = AdocaoController;
