const amqp = require('amqplib');

const QUEUE_ADOCAO   = 'adocao_solicitacoes';
const MAX_TENTATIVAS = 5;
const DELAY_MS       = 3000; // 3s entre tentativas

let channel = null;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function conectar(tentativa = 1) {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost';
  try {
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_ADOCAO, { durable: true });
    channel.prefetch(1);
    console.log('✅ RabbitMQ conectado');

    connection.on('error', (err) => {
      console.error('❌ RabbitMQ erro:', err.message);
      channel = null;
    });
    connection.on('close', () => {
      console.warn('⚠️  RabbitMQ desconectado — tentando reconectar em 5s...');
      channel = null;
      setTimeout(() => conectar(), 5000);
    });
  } catch (err) {
    if (tentativa < MAX_TENTATIVAS) {
      console.warn(`⚠️  RabbitMQ indisponivel (tentativa ${tentativa}/${MAX_TENTATIVAS}) — nova tentativa em ${DELAY_MS / 1000}s...`);
      await esperar(DELAY_MS);
      return conectar(tentativa + 1);
    }
    console.warn('⚠️  RabbitMQ nao respondeu apos todas as tentativas. Mensageria desativada.');
    channel = null;
  }
}

function getChannel() {
  return channel;
}

module.exports = { conectar, getChannel, QUEUE_ADOCAO };
