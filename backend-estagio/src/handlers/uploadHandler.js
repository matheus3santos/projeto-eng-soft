// src/handlers/uploadHandler.js

const multer = require('multer');
const { containerClient } = require('../azure/storage');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadPDF = async (file) => {
  try {
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    const pdfUrl = blockBlobClient.url;
    return pdfUrl;
  } catch (err) {
    console.error('Erro ao armazenar o arquivo PDF no Azure:', err);
    return null;
  }
};

module.exports = { upload, uploadPDF };
