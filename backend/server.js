const express = require('express')
const cors = require('cors')
const db = require('./db/database')
const router = express.Router()
const app = express()
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(cors())
app.use(express.json())


app.use(bodyParser.json())


app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    else {
      res.json(rows)
    }
  })
})

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users where id = (?)', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    else {
      res.json({ user: row })
    }
  })
})

app.post('/users', (req, res) => {
  const { name, avatar_url } = req.body;
  console.log("Recebido:", name); // Log para ver o nome recebido

  if (!name) {
    console.log("Erro: Nome é obrigatório");
    return res.status(400).json({ error: "O nome é obrigatório" });
  }

  // Verificar se o nome já está registrado
  db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.log("Erro ao verificar o banco de dados:", err);
      return res.status(500).json({ error: "Erro ao verificar o banco de dados" });
    }

    if (row) {
      console.log("Erro: Nome já registrado");
      return res.status(400).json({ error: "Nome já registrado" });
    }

    // Inserir o novo nome no banco de dados
    db.run("INSERT INTO users (name,avatar_url) VALUES (?,?)", [name, avatar_url], (err) => {
      if (err) {
        console.log("Erro ao inserir dados no banco de dados:", err);
        return res.status(500).json({ error: "Erro ao inserir dados no banco de dados" });
      }
      console.log("Dados inseridos com sucesso");
      res.status(200).json({ message: "Dados inseridos com sucesso" });
    });
  });
});

app.delete("/del/:id", (req, res) => {
  console.log("entrou")

  const { id } = req.params
  console.log(id)

  db.run('DELETE FROM  users WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    else {
      res.json({ changes: this.changes })

    }
  })

})

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  
  const { name, avatar_url } = req.body;
  db.run('UPDATE users SET (name,avatar_url) = (?,?) WHERE id = ?', [name,avatar_url,id], [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    else {
      res.json({ changes: this.changes })

    }
  })
})


// Resposta padrão para quaisquer outras requisições:

app.use((req, res) => {
  res.status(404)
})

const server = app.listen(port, () => {
  console.log("servidor ativo")
})
const shutdown = () => {
  console.log('Fechando o servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    console.log('Fechando o banco de dados...');
    db.close((err) => {
      if (err) {
        console.error('Erro ao fechar o banco de dados:', err.message);
      } else {
        console.log('Banco de dados fechado.');
      }
      process.exit(0);
    });
  });
};

// Captura os sinais SIGINT e SIGTERM para encerrar o servidor corretamente
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/*
// Força o encerramento do processo após um timeout para garantir que o fechamento ocorra
setTimeout(() => {
  console.log('Timeout forçado para encerrar o servidor.');
  process.exit(1);
}, 10000); // 10 segundos
*/