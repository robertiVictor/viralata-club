class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }

  async listarDisponiveis(filtros) {
    return this.petRepository.findByFilters({ ...filtros, status: 'disponivel' });
  }

  async buscarPorId(id) {
    return this.petRepository.findById(id);
  }

  async criarPet(dados) {
    return this.petRepository.create(dados);
  }

  async atualizarPet(id, dados) {
    return this.petRepository.update(id, dados);
  }

  async excluirPet(id) {
    return this.petRepository.delete(id);
  }
}

module.exports = PetService;
