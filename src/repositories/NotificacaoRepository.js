const { getPool } = require('../config/database');

class NotificacaoRepository {
  async create({ admin_id, adocao_id, titulo, conteudo }) {
    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO notificacoes (admin_id, adocao_id, titulo, conteudo)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [admin_id, adocao_id, titulo, conteudo]
    );
    return rows[0];
  }

  async findByAdmin(admin_id) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT n.*, a.pet_id, p.nome AS pet_nome
       FROM notificacoes n
       JOIN adocoes a ON a.id = n.adocao_id
       JOIN pets p ON p.id = a.pet_id
       WHERE n.admin_id = $1
       ORDER BY n.created_at DESC`,
      [admin_id]
    );
    return rows;
  }

  async marcarComoLida(id) {
    const pool = getPool();
    const { rows } = await pool.query(
      'UPDATE notificacoes SET lida = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return rows[0] || null;
  }

  async findAdmins() {
    const pool = getPool();
    const { rows } = await pool.query("SELECT id FROM users WHERE role = 'admin'");
    return rows;
  }
}

module.exports = NotificacaoRepository;
