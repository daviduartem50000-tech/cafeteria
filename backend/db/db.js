require('dotenv').config();
const mysql = require('mysql2/promise');

// O Railway costuma expor variáveis no formato MYSQLHOST, MYSQLUSER, etc.
// quando você adiciona o plugin de MySQL ao projeto. Aqui aceitamos tanto
// esse padrão quanto variáveis DB_* (usadas em ambiente local via .env).
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'cafeteria',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
