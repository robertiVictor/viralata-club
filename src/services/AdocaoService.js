const MensageriaService = require('./MensageriaService');

class AdocaoService {
  constructor(adocaoRepository, petRepository, notificacaoRepository) {
    this.adocaoRepository     = adocaoRepository;
    this.petRepository        = petRepository;
    this.notificacaoRepository = notificacaoRepository;
    this.mensageriaService    = new MensageriaService();
  }

  async enviarInteresse({ pet_id, adotante_id, mensagem, perguntas, doc_identidade_url, foto_local_url }) {
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

    const solicitacoesAtivas = await this.adocaoRepository.findByPetAndStatus(pet_id, ['pendente', 'em_analise']);
    if (solicitacoesAtivas.length > 0) {
      const error = new Error('Este pet já possui uma solicitação em análise');
      error.statusCode = 409;
      throw error;
    }

    // Criar solicitação com status 'pendente' — o worker vai mover para 'em_analise'
    const adocao = await this.adocaoRepository.create({ pet_id, adotante_id, mensagem, perguntas, doc_identidade_url, foto_local_url });

    // Publicar na fila para processamento assíncrono
    const publicado = this.mensageriaService.publicarSolicitacaoAdocao({
      adocao_id: adocao.id,
      pet_id,
      adotante_id,
      pet_nome: pet.nome,
    });

    // Fallback síncrono quando RabbitMQ está indisponível
    if (!publicado) {
      await this.petRepository.updateStatus(pet_id, 'em_analise');
      await this.adocaoRepository.updateStatus(adocao.id, 'em_analise');
      const admins = await this.notificacaoRepository.findAdmins();
      for (const admin of admins) {
        await this.notificacaoRepository.create({
          admin_id: admin.id,
          adocao_id: adocao.id,
          titulo: 'Nova solicitação de adoção',
          conteudo: `Nova solicitação de adoção para o pet "${pet.nome}".`,
        });
      }
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

    // Notificar adotante em tempo real via WebSocket
    if (global.io) {
      global.io.to(`user:${adocao.adotante_id}`).emit('adocao:atualizada', {
        adocao_id: id,
        status: 'aprovada',
        mensagem: `Parabéns! Sua adoção de "${adocao.pet_nome}" foi APROVADA! 🎉`,
      });
    }

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

    // Notificar adotante em tempo real via WebSocket
    if (global.io) {
      global.io.to(`user:${adocao.adotante_id}`).emit('adocao:atualizada', {
        adocao_id: id,
        status: 'rejeitada',
        mensagem: `Sua solicitação de adoção de "${adocao.pet_nome}" foi rejeitada.`,
      });
    }

    return adocaoAtualizada;
  }
}

module.exports = AdocaoService;
