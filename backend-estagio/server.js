// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/database/connection');
const estagioRoutes = require('./src/routes/estagios');

const app = express();
const PORT = 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Banco de dados conectado com sucesso.');

    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado.');

    app.use(bodyParser.json());
    app.use(cors({ origin: "http://localhost:3000" }));
    app.use('/api/estagios', estagioRoutes);

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();
