//db config, connect to maria
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host:     process.env.MARIA_HOST,
    port:     process.env.MARIA_PORT || 3306,
    user:     process.env.MARIA_USER,
    password: process.env.MARIA_PASSWORD,
    database: process.env.MARIA_DB,
    connectionLimit: 10
});

module.exports = pool;