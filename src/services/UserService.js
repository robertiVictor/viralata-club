class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async listarTodos() {
    return this.userRepository.findAll();
  }

  async listarPendentes() {
    return this.userRepository.findAllPendentes();
  }

  async aprovarCadastro(id) {
    const user = await this.userRepository.atualizarStatusCadastro(id, 'aprovado');
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async rejeitarCadastro(id) {
    const user = await this.userRepository.atualizarStatusCadastro(id, 'rejeitado');
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async bloquear(id) {
    const user = await this.userRepository.bloquear(id);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async excluir(id) {
    const excluido = await this.userRepository.delete(id);
    if (!excluido) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
}

module.exports = UserService;
