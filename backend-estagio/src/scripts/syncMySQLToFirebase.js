const { sequelize, syncToFirebase } = require('../database/connection');

async function syncMySQLToFirebase() {
  try {
    // Busca todos os registros no MySQL
    const [rows] = await sequelize.query('SELECT * FROM estagios');

    // Sincroniza cada registro com o Firebase
    for (const estagio of rows) {
      await syncToFirebase(estagio);
    }

    console.log('Sincronização completa dos dados do MySQL para o Firebase!');
  } catch (error) {
    console.error('Erro ao sincronizar dados do MySQL para o Firebase:', error);
  }
}

// Executa a sincronização
syncMySQLToFirebase();
