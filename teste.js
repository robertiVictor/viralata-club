require('dotenv').config();
const { Pool } = require('pg');

console.log('🔧 Testando conexão com:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('ERRO:', err.message);
  } else {
    console.log('CONECTADO COM SUCESSO!');
    release();
  }
  process.exit();
});