const dbPool = require('../dbConnection');
const bcrypt = require('bcrypt');

async function setGodUser() {
  await dbPool.execute(`
    CREATE TABLE IF NOT EXISTS managers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(64) NOT NULL
    )
  `);

  const [rows] = await dbPool.execute(
    'SELECT COUNT(*) as total FROM managers WHERE email = ?',
    [process.env.EMAIL_GOD]
  );
  const exists = rows[0].total > 0;

  if (!exists) {
    const senha = process.env.SENHA_GOD;
    const senhaHash = await bcrypt.hash(senha, 12);

    await dbPool.execute(`
      INSERT INTO managers (name, email, password_hash)
      VALUES (?, ?, ?)
    `, ['goduser', process.env.EMAIL_GOD, senhaHash]);
  }
}

async function setSimulatorsTable() {
  await dbPool.execute(`
    CREATE TABLE IF NOT EXISTS simulators (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      repo_link TEXT,
      images JSON,
      manual TEXT,
      articles JSON
    )
  `);
  
    console.log("Table simulators OK");
}

async function setupDatabase() {
    await setGodUser();
    await setSimulatorsTable();
}

module.exports = { setupDatabase };