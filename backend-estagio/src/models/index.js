const { Estagio } = require('./Estagio');
const { PDFLink } = require('./PdfLink');

Estagio.hasOne(PDFLink, { foreignKey: 'estagioId', onDelete: 'CASCADE' });
PDFLink.belongsTo(Estagio, { foreignKey: 'estagioId' });

module.exports = { Estagio, PDFLink };
