const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/database/connection'); // Conexão com o banco
const estagioRoutes = require('./src/routes/estagios'); // Rotas de estágios
const cors = require("cors"); // Importa a biblioteca cors


const app = express();
const PORT = 3001;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rotas
app.use(cors({ origin: "http://localhost:3000" })); // Permite apenas o front-end local
app.use('/api/estagios', estagioRoutes);

// Sincronizar o banco e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    console.log('Conectado ao banco de dados e tabelas sincronizadas.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${3306}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
