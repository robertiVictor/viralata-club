class NotificacaoService {
  constructor(notificacaoRepository) {
    this.notificacaoRepository = notificacaoRepository;
  }

  async listarPorAdmin(admin_id) {
    return this.notificacaoRepository.findByAdmin(admin_id);
  }

  async marcarComoLida(id) {
    const notificacao = await this.notificacaoRepository.marcarComoLida(id);
    if (!notificacao) {
      const error = new Error('Notificação não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return notificacao;
  }
}

module.exports = NotificacaoService;
