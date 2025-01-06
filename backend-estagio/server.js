const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const realtimeDB = require('./src/database/firebaseConfig'); // Importa a configuração do Firebase
const estagioRoutes = require('./src/routes/estagios');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Roteamento para estágios
app.use('/api/estagios', estagioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
