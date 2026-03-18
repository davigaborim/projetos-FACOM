//db config, connect to maria
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host:     process.env.MARIA_HOST,
    port:     process.env.MARIA_PORT || 3306,
    user:     process.env.MARIA_USER,
    password: process.env.MARIA_PASSWORD,
    database: process.env.MARIA_DB,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;