const { getPool } = require('../config/database');

class PetRepository {
  async findByFilters({ especie, porte, idade_min, idade_max, sexo, cidade, estado, page, limit }) {
    const pool = getPool();
    const conditions = ["status = 'disponivel'"];
    const values = [];
    let idx = 1;

    if (especie) { conditions.push(`especie = $${idx++}`); values.push(especie); }
    if (porte) { conditions.push(`porte = $${idx++}`); values.push(porte); }
    if (sexo) { conditions.push(`sexo = $${idx++}`); values.push(sexo); }
    if (idade_min) { conditions.push(`idade >= $${idx++}`); values.push(idade_min); }
    if (idade_max) { conditions.push(`idade <= $${idx++}`); values.push(idade_max); }
    if (cidade) { conditions.push(`LOWER(cidade) LIKE LOWER($${idx++})`); values.push(`%${cidade}%`); }
    if (estado) { conditions.push(`estado = $${idx++}`); values.push(estado.toUpperCase()); }

    const where = conditions.join(' AND ');
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM pets WHERE ${where}`;
    const dataQuery = `SELECT * FROM pets WHERE ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, values),
      pool.query(dataQuery, [...values, limit, offset]),
    ]);

    return {
      pets: dataResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    };
  }

  async findById(id) {
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async create(data) {
    const pool = getPool();
    const { nome, especie, porte, idade, sexo, historico_saude, descricao, imagem_url, cidade, estado } = data;
    const { rows } = await pool.query(
      `INSERT INTO pets (nome, especie, porte, idade, sexo, historico_saude, descricao, imagem_url, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nome, especie, porte, idade, sexo, historico_saude, descricao, imagem_url, cidade || null, estado ? estado.toUpperCase() : null]
    );
    return rows[0];
  }

  async update(id, data) {
    const pool = getPool();
    const fields = [];
    const values = [id];
    let idx = 2;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const { rows } = await pool.query(
      `UPDATE pets SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  async updateStatus(id, status) {
    const pool = getPool();
    const { rows } = await pool.query(
      'UPDATE pets SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, status]
    );
    return rows[0] || null;
  }

  async delete(id) {
    const pool = getPool();
    const { rowCount } = await pool.query('DELETE FROM pets WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = PetRepository;
