const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const filepath = "./teste.db"




const db = new sqlite3.Database(filepath, (err) => {
    if (err) {
        console.error(err.message)
    }
    else {
        console.log('Conectado ao banco de dados SQLite.');

    }
});



db.serialize(() => {
    // Cria uma tabela de usuários se não existir
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar_url TEXT NOT NULL
    )`);
  });



module.exports = db