const dbPool = require('../dbConnection');
const bcrypt = require('bcrypt');

async function setGodUser() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS managers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(64) NOT NULL
    )
  `);

  const exists = (await dbPool.query(
    'SELECT EXISTS (SELECT 1 FROM managers WHERE email = $1)',
    ['goduser@gmail.com']
  )).rows[0].exists;

  if (!exists) {
    const senha = process.env.SENHA_GOD;
    const senhaHash = await bcrypt.hash(senha, 10);

    await dbPool.query(`
      INSERT INTO managers (name, email, password_hash)
      VALUES ($1, $2, $3)
    `, ['goduser', 'goduser@gmail.com', senhaHash]);
  }
}

async function setSimulatorsTable() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS simulators (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      repo_link TEXT,
      images TEXT[],
      manual TEXT,
      articles TEXT[]
    )
  `);

    console.log("Table simulators OK");
}

async function setupDatabase() {
    await setGodUser();
    await setSimulatorsTable();
}

module.exports = { setupDatabase };