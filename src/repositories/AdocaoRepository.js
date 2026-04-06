const { getPool } = require('../config/database');

class AdocaoRepository {
  async create({ pet_id, adotante_id, mensagem }) {
    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO adocoes (pet_id, adotante_id, mensagem)
       VALUES ($1, $2, $3) RETURNING *`,
      [pet_id, adotante_id, mensagem]
    );
    return rows[0];
  }

  async findByPetAndStatus(pet_id, statusList) {
    const pool = getPool();
    const placeholders = statusList.map((_, i) => `$${i + 2}`).join(', ');
    const { rows } = await pool.query(
      `SELECT * FROM adocoes WHERE pet_id = $1 AND status IN (${placeholders})`,
      [pet_id, ...statusList]
    );
    return rows;
  }

  async findByAdotante(adotante_id) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT a.*, p.nome AS pet_nome, p.especie, p.imagem_url
       FROM adocoes a
       JOIN pets p ON p.id = a.pet_id
       WHERE a.adotante_id = $1
       ORDER BY a.created_at DESC`,
      [adotante_id]
    );
    return rows;
  }

  async findAll() {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT a.*, p.nome AS pet_nome, p.especie, p.imagem_url,
              u.nome AS adotante_nome, u.email AS adotante_email, u.telefone AS adotante_telefone
       FROM adocoes a
       JOIN pets p ON p.id = a.pet_id
       JOIN users u ON u.id = a.adotante_id
       ORDER BY a.created_at DESC`
    );
    return rows;
  }

  async findById(id) {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT a.*, p.nome AS pet_nome, u.nome AS adotante_nome
       FROM adocoes a
       JOIN pets p ON p.id = a.pet_id
       JOIN users u ON u.id = a.adotante_id
       WHERE a.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  async updateStatus(id, status) {
    const pool = getPool();
    const { rows } = await pool.query(
      'UPDATE adocoes SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, status]
    );
    return rows[0] || null;
  }
}

module.exports = AdocaoRepository;
