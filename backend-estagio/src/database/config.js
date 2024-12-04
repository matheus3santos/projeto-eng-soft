const { Sequelize } = require('sequelize');

//ALTERAR AQUI O NOME DO BANCO, USUÁRIO E SENHA QUE VOCÊ VAI UTILIZAR
const sequelize = new Sequelize('estagios_db', 'matheus', '12345', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
