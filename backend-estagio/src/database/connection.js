// src/database/connection.js

const { Sequelize } = require('sequelize');
import database from "./firebaseConfig"; // Configuração do Firebase


// Configuração do banco de dados (alterar conforme necessário)
const DB_NAME = 'estagios_db';
const DB_USER = 'matheus';
const DB_PASSWORD = '12345';
const DB_HOST = 'localhost';
const DIALECT = 'mysql';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DIALECT,
});

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

module.exports = { sequelize, syncToFirebase };
