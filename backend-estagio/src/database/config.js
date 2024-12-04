const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('estagios_db', 'matheus', '12345', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
