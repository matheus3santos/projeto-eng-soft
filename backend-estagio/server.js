const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/database/connection'); // Conexão com o banco
const estagioRoutes = require('./src/routes/estagios'); // Rotas de estágios
const cors = require("cors"); // Importa a biblioteca cors
const socketIo = require("socket.io"); // Importa o socket.io
const { Estagio } = require("./src/models/Estagio"); // Modelo de Estágio

const app = express();
const PORT = 3001;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuração do CORS
app.use(cors({ origin: "http://localhost:3000" })); // Permite apenas o front-end local

// Configuração do Socket.IO com CORS
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Inicializa o Socket.IO no servidor com a configuração CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Permite apenas conexões do front-end rodando na porta 3000
    methods: ["GET", "POST","PUT","DELETE"],         // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Cabeçalhos permitidos
    credentials: true                 // Permite o envio de cookies
  }
});

// Quando um cliente se conecta via WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Desconexão do cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Rotas
app.use('/api/estagios', estagioRoutes);

// Sincronizar o banco e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    console.log('Conectado ao banco de dados e tabelas sincronizadas.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

// Rota para adicionar um novo estágio
app.post("/api/estagios", async (req, res) => {
  try {
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;
    const novoEstagio = await Estagio.create({ estudante, orientador, empresa, agenteIntegracao });

    // Envia a atualização para todos os clientes conectados via WebSocket
    io.emit("estagio criado", novoEstagio);

    res.status(201).json(novoEstagio);
  } catch (error) {
    res.status(500).send("Erro ao criar estágio");
  }
});

// Rota para atualizar um estágio
app.put("/api/estagios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;

    const [updated] = await Estagio.update(
      { estudante, orientador, empresa, agenteIntegracao },
      { where: { id } }
    );

    if (updated) {
      const updatedEstagio = await Estagio.findByPk(id);

      // Envia a atualização para todos os clientes conectados via WebSocket
      io.emit("estagio atualizado", updatedEstagio);

      res.status(200).json(updatedEstagio);
    } else {
      res.status(404).send("Estágio não encontrado");
    }
  } catch (error) {
    res.status(500).send("Erro ao atualizar estágio");
  }
});

// Rota para deletar um estágio
app.delete("/api/estagios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Estagio.destroy({ where: { id } });

    // Envia a atualização para todos os clientes conectados via WebSocket
    io.emit("estagio deletado", id);

    res.status(200).send("Estágio deletado");
  } catch (error) {
    res.status(500).send("Erro ao deletar estágio");
  }
});
