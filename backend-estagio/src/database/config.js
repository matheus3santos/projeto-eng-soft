// // src/database/config.js

// const Estagio = require('../models/Estagio');
// const PDFLink = require('../models/PdfLink');


// module.exports = {
//   DB_NAME: 'estagios_db',
//   DB_USER: 'matheus',
//   DB_PASSWORD: '12345',
//   DB_HOST: 'localhost',
//   DIALECT: 'mysql',
// };

// Estagio.hasOne(PDFLink, { foreignKey: 'estagioId', onDelete: 'CASCADE' });
// PDFLink.belongsTo(Estagio, { foreignKey: 'estagioId' });

// module.exports = { Estagio, PDFLink };