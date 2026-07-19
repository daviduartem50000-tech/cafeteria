require('dotenv').config();
const mysql = require('mysql2/promise');

// Preferência: usar a string de conexão única (DATABASE_URL), que referencia
// o MYSQL_URL do serviço MySQL no Railway. Mais simples e evita erro de
// variável individual não resolvida.
// Fallback: variáveis separadas (MYSQLHOST, MYSQLUSER, etc.) ou DB_* locais.
const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
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
