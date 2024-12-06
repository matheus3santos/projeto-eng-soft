const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Estagio = sequelize.define('Estagio', {
  estudante: { type: DataTypes.STRING, allowNull: false },
  orientador: { type: DataTypes.STRING, allowNull: false },
  empresa: { type: DataTypes.STRING, allowNull: false },
  agenteIntegracao: { type: DataTypes.STRING, allowNull: true },
  pdfUrl: { type: DataTypes.STRING, allowNull: true },
});

module.exports = { Estagio };  // Exportação correta
