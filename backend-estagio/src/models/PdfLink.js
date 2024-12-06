const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const { Estagio } = require('./Estagio');  // Importa o modelo Estagio corretamente

const PDFLink = sequelize.define('PDFLink', {
  estagioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estagio,
      key: 'id',
    },
  },
  pdfUrl: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { PDFLink };  // Exportação correta