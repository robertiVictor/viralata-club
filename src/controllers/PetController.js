const PetService = require('../services/PetService');
const PetRepository = require('../repositories/PetRepository');
const ResponseFactory = require('../helpers/ResponseFactory');

const petService = new PetService(new PetRepository());

class PetController {
  async listar(req, res, next) {
    try {
      const { especie, porte, idade_min, idade_max, sexo, cidade, estado, page, limit } = req.query;
      const resultado = await petService.listarDisponiveis({
        especie, porte, idade_min, idade_max, sexo, cidade, estado,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
      });
      return ResponseFactory.success(res, resultado);
    } catch (err) {
      next(err);
    }
  }

  async detalhe(req, res, next) {
    try {
      const pet = await petService.buscarPorId(req.params.id);
      if (!pet) return ResponseFactory.notFound(res, 'Pet não encontrado');
      return ResponseFactory.success(res, pet);
    } catch (err) {
      next(err);
    }
  }

  async criar(req, res, next) {
    try {
      const novoPet = await petService.criarPet(req.body);
      return ResponseFactory.created(res, novoPet, 'Pet cadastrado com sucesso');
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req, res, next) {
    try {
      const petAtualizado = await petService.atualizarPet(req.params.id, req.body);
      if (!petAtualizado) return ResponseFactory.notFound(res, 'Pet não encontrado');
      return ResponseFactory.success(res, petAtualizado, 'Pet atualizado com sucesso');
    } catch (err) {
      next(err);
    }
  }

  async excluir(req, res, next) {
    try {
      const excluido = await petService.excluirPet(req.params.id);
      if (!excluido) return ResponseFactory.notFound(res, 'Pet não encontrado');
      return ResponseFactory.success(res, null, 'Pet excluído com sucesso');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PetController;
