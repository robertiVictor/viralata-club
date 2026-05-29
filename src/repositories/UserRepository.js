const { getPool } = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, nome, email, telefone, role, bloqueado,
              status_cadastro, documento_url, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async create({ nome, email, senha_hash, telefone, documento_url }) {
    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO users (nome, email, senha_hash, telefone, documento_url, status_cadastro)
       VALUES ($1, $2, $3, $4, $5, 'pendente')
       RETURNING id, nome, email, role, status_cadastro, created_at`,
      [nome, email, senha_hash, telefone || null, documento_url || null]
    );
    return rows[0];
  }

  async findAll() {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, nome, email, telefone, role, bloqueado,
              status_cadastro, documento_url, created_at
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

  async findAllPendentes() {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, nome, email, telefone, role, bloqueado,
              status_cadastro, documento_url, created_at
       FROM users WHERE status_cadastro = 'pendente'
       ORDER BY created_at ASC`
    );
    return rows;
  }

  async atualizarStatusCadastro(id, status) {
    const pool = getPool();
    const { rows } = await pool.query(
      `UPDATE users SET status_cadastro = $2
       WHERE id = $1
       RETURNING id, nome, email, status_cadastro`,
      [id, status]
    );
    return rows[0] || null;
  }

  async bloquear(id) {
    const pool = getPool();
    const { rows } = await pool.query(
      'UPDATE users SET bloqueado = NOT bloqueado WHERE id = $1 RETURNING id, nome, email, bloqueado',
      [id]
    );
    return rows[0] || null;
  }

  async delete(id) {
    const pool = getPool();
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = UserRepository;
