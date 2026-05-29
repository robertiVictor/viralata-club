require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const path           = require('path');
const { createServer } = require('http');
const { Server }     = require('socket.io');

const authRoutes         = require('./routes/authRoutes');
const petRoutes          = require('./routes/petRoutes');
const adocaoRoutes       = require('./routes/adocaoRoutes');
const userRoutes         = require('./routes/userRoutes');
const notificacaoRoutes  = require('./routes/notificacaoRoutes');
const uploadRoutes       = require('./routes/uploadRoutes');
const errorHandler       = require('./middlewares/errorHandler');

const { conectar }      = require('./config/rabbitmq');
const { iniciarWorker } = require('./workers/adocaoWorker');

const app        = express();
const httpServer = createServer(app);

// ── WebSocket (Socket.IO) ───────────────────────────────────────────────────
const io = new Server(httpServer, { cors: { origin: '*' } });
global.io = io;

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`🔌 WebSocket: usuário ${userId} conectado`);
  }
  socket.on('disconnect', () => {
    if (userId) console.log(`🔌 WebSocket: usuário ${userId} desconectado`);
  });
});

// ── Middlewares globais ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Rotas da API ─────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/pets',         petRoutes);
app.use('/api/adocoes',      adocaoRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/upload',       uploadRoutes);

// ── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Inicialização ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

(async () => {
  await conectar();
  iniciarWorker();
  httpServer.listen(PORT, () => {
    console.log(`🐕 ViraLata Club rodando em http://localhost:${PORT}`);
  });
})();
