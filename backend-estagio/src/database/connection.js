// src/database/connection.js

const { Sequelize } = require('sequelize');

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

module.exports = sequelize;
