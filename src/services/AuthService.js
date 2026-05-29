const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ nome, email, senha, telefone, documento_url }) {
    if (!documento_url) {
      const error = new Error('O envio de documento de identificação é obrigatório');
      error.statusCode = 400;
      throw error;
    }

    const existente = await this.userRepository.findByEmail(email);
    if (existente) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 409;
      throw error;
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const user = await this.userRepository.create({ nome, email, senha_hash, telefone, documento_url });
    return user;
  }

  async login({ email, senha }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('E-mail ou senha inválidos');
      error.statusCode = 401;
      throw error;
    }

    if (user.bloqueado) {
      const error = new Error('Conta bloqueada. Entre em contato com a administração');
      error.statusCode = 403;
      throw error;
    }

    if (user.status_cadastro === 'pendente') {
      const error = new Error('Seu cadastro está aguardando aprovação da equipe ViraLata Club');
      error.statusCode = 403;
      throw error;
    }

    if (user.status_cadastro === 'rejeitado') {
      const error = new Error('Seu cadastro foi rejeitado. Entre em contato com a administração');
      error.statusCode = 403;
      throw error;
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      const error = new Error('E-mail ou senha inválidos');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      user: { id: user.id, nome: user.nome, role: user.role },
    };
  }

  async me(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;
