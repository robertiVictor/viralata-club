class AdocaoService {
  constructor(adocaoRepository, petRepository, notificacaoRepository) {
    this.adocaoRepository = adocaoRepository;
    this.petRepository = petRepository;
    this.notificacaoRepository = notificacaoRepository;
  }

  async enviarInteresse({ pet_id, adotante_id, mensagem }) {
    // Verificar se o pet existe e está disponível
    const pet = await this.petRepository.findById(pet_id);
    if (!pet) {
      const error = new Error('Pet não encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (pet.status !== 'disponivel') {
      const error = new Error('Este pet não está disponível para adoção');
      error.statusCode = 409;
      throw error;
    }

    // Verificar se já existe solicitação ativa para este pet
    const solicitacoesAtivas = await this.adocaoRepository.findByPetAndStatus(pet_id, ['pendente', 'em_analise']);
    if (solicitacoesAtivas.length > 0) {
      const error = new Error('Este pet já possui uma solicitação em análise');
      error.statusCode = 409;
      throw error;
    }

    // Criar solicitação
    const adocao = await this.adocaoRepository.create({ pet_id, adotante_id, mensagem });

    // Mudar status do pet para em_analise
    await this.petRepository.updateStatus(pet_id, 'em_analise');

    // Notificar todos os admins
    const admins = await this.notificacaoRepository.findAdmins();
    for (const admin of admins) {
      await this.notificacaoRepository.create({
        admin_id: admin.id,
        adocao_id: adocao.id,
        titulo: 'Nova solicitação de adoção',
        conteudo: `Nova solicitação de adoção para o pet "${pet.nome}".`,
      });
    }

    return adocao;
  }

  async listarMinhas(adotante_id) {
    return this.adocaoRepository.findByAdotante(adotante_id);
  }

  async listarTodas() {
    return this.adocaoRepository.findAll();
  }

  async aprovar(id) {
    const adocao = await this.adocaoRepository.findById(id);
    if (!adocao) {
      const error = new Error('Solicitação não encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (adocao.status !== 'pendente' && adocao.status !== 'em_analise') {
      const error = new Error('Esta solicitação não pode ser aprovada');
      error.statusCode = 409;
      throw error;
    }

    const adocaoAtualizada = await this.adocaoRepository.updateStatus(id, 'aprovada');
    await this.petRepository.updateStatus(adocao.pet_id, 'adotado');

    return adocaoAtualizada;
  }

  async rejeitar(id) {
    const adocao = await this.adocaoRepository.findById(id);
    if (!adocao) {
      const error = new Error('Solicitação não encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (adocao.status !== 'pendente' && adocao.status !== 'em_analise') {
      const error = new Error('Esta solicitação não pode ser rejeitada');
      error.statusCode = 409;
      throw error;
    }

    const adocaoAtualizada = await this.adocaoRepository.updateStatus(id, 'rejeitada');
    await this.petRepository.updateStatus(adocao.pet_id, 'disponivel');

    return adocaoAtualizada;
  }
}

module.exports = AdocaoService;
