// src/database/connection.js

const database = require('./firebaseConfig'); // Configuração do Firebase


// Função para sincronizar um registro com o Firebase
async function syncToFirebase(estagio) {
  try {
    const ref = database.ref('estagios');
    await ref.push(estagio);
    console.log('Registro sincronizado com o Firebase:', estagio);
  } catch (error) {
    console.error('Erro ao sincronizar com o Firebase:', error);
  }
}

module.exports = { syncToFirebase };
