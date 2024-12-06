// src/azure/storage.js

const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage Connection String não configurado.');
}

// Conectar ao serviço Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const containerName = 'pdf-estagios';
const containerClient = blobServiceClient.getContainerClient(containerName);

module.exports = {
  containerClient,
};
