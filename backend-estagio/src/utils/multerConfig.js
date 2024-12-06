//src/utils/multerConfig.js

const multer = require('multer');

// Configura o armazenamento no memory storage (temporário)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
