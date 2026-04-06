require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const adocaoRoutes = require('./routes/adocaoRoutes');
const userRoutes = require('./routes/userRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adocoes', adocaoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler (sempre por último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐕 ViraLata Club rodando em http://localhost:${PORT}`);
});
