const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Estagio = sequelize.define('Estagio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  estudante: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orientador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agenteIntegracao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, // Cria colunas createdAt e updatedAt
});

module.exports = Estagio;
