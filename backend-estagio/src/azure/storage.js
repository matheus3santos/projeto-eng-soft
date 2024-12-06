// src/azure/storage.js

const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const dotenv = require('dotenv');


dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;


if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage Connection String não configurado.');
}

// Conectar ao serviço Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'pdf-estagios';
const containerClient = blobServiceClient.getContainerClient(containerName);

const generateSasUrl = async (blobName) => {
  const expiryTime = new Date(new Date().valueOf() + 3600 * 1000);  // Link válido por 1 hora.

  const blobClient = containerClient.getBlobClient(blobName);
  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName,
    expiresOn: expiryTime,
  }, blobClient.credential).toString();

  const url = `${blobClient.url}?${sasToken}`;
  return url;
};

module.exports = {
  containerClient,
  generateSasUrl,
};

