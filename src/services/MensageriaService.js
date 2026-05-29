const { getChannel, QUEUE_ADOCAO } = require('../config/rabbitmq');

class MensageriaService {
  /**
   * Publica uma solicitação de adoção na fila do RabbitMQ
   * para processamento assíncrono pelo worker.
   * Retorna true se publicou com sucesso, false se o broker estiver indisponível.
   */
  publicarSolicitacaoAdocao(payload) {
    const channel = getChannel();
    if (!channel) {
      console.warn('⚠️  RabbitMQ indisponível — fallback síncrono ativado');
      return false;
    }
    channel.sendToQueue(
      QUEUE_ADOCAO,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
    console.log(`📨 Publicado na fila "${QUEUE_ADOCAO}": adocao_id=${payload.adocao_id}`);
    return true;
  }
}

module.exports = MensageriaService;
