/**
 * Worker (Consumer) — processa solicitações de adoção da fila RabbitMQ.
 *
 * Fluxo assíncrono:
 *  1. Recebe mensagem da fila "adocao_solicitacoes"
 *  2. Atualiza pet → em_analise
 *  3. Atualiza adoção → em_analise
 *  4. Cria notificações para todos os admins
 *  5. Emite evento WebSocket para o adotante (atualização em tempo real)
 */

const { getChannel, QUEUE_ADOCAO } = require('../config/rabbitmq');
const AdocaoRepository    = require('../repositories/AdocaoRepository');
const PetRepository       = require('../repositories/PetRepository');
const NotificacaoRepository = require('../repositories/NotificacaoRepository');

const adocaoRepository     = new AdocaoRepository();
const petRepository        = new PetRepository();
const notificacaoRepository = new NotificacaoRepository();

function iniciarWorker() {
  const channel = getChannel();
  if (!channel) {
    console.warn('⚠️  Worker de adoção não iniciado: RabbitMQ indisponível');
    return;
  }

  channel.consume(QUEUE_ADOCAO, async (msg) => {
    if (!msg) return;

    let payload;
    try {
      payload = JSON.parse(msg.content.toString());
      const { adocao_id, pet_id, adotante_id, pet_nome } = payload;

      console.log(`⚙️  Worker processando adocao_id=${adocao_id}`);

      // 1. Mudar pet para em_analise
      await petRepository.updateStatus(pet_id, 'em_analise');

      // 2. Mudar adoção para em_analise
      await adocaoRepository.updateStatus(adocao_id, 'em_analise');

      // 3. Notificar admins
      const admins = await notificacaoRepository.findAdmins();
      for (const admin of admins) {
        await notificacaoRepository.create({
          admin_id: admin.id,
          adocao_id,
          titulo: 'Nova solicitação de adoção',
          conteudo: `Nova solicitação de adoção para o pet "${pet_nome}".`,
        });
      }

      // 4. Emitir evento WebSocket em tempo real para o adotante
      if (global.io) {
        global.io.to(`user:${adotante_id}`).emit('adocao:atualizada', {
          adocao_id,
          status: 'em_analise',
          mensagem: 'Sua solicitação está sendo analisada pela equipe. Avisaremos quando houver uma decisão!',
        });
      }

      console.log(`✅ Adoção ${adocao_id} processada com sucesso`);
      channel.ack(msg);
    } catch (err) {
      console.error('❌ Erro ao processar mensagem:', err.message);
      channel.nack(msg, false, true); // recoloca na fila
    }
  });

  console.log(`🐇 Worker aguardando mensagens em "${QUEUE_ADOCAO}"...`);
}

module.exports = { iniciarWorker };
