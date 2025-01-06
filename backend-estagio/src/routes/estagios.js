//src/routes/estagios.js

const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');
const { Estagio } = require('../models/Estagio'); // Certifique-se de que o caminho está correto
const realtimeDB = require("./firebase"); // Importa a instância do Firebase
const router = express.Router();
// Configuração do multer
const upload = multer({ storage: multer.memoryStorage() });
const { sequelize, syncToFirebase } = require('../database/connection');


dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'estagios';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);



// Rota para criar um novo estágio
router.post('/api/estagios', async (req, res) => {
  const { estudante, orientador, empresa, agenteIntegracao } = req.body;

  try {
    // Insere no MySQL
    const [result] = await sequelize.query(
      `INSERT INTO estagios (estudante, orientador, empresa, agenteIntegracao) 
       VALUES (?, ?, ?, ?)`,
      { replacements: [estudante, orientador, empresa, agenteIntegracao] }
    );

    const novoEstagio = {
      id: result, // ID gerado pelo MySQL
      estudante,
      orientador,
      empresa,
      agenteIntegracao,
    };

    // Sincroniza o novo estágio com o Firebase
    await syncToFirebase(novoEstagio);

    res.status(201).json({ message: 'Estágio criado com sucesso!', estagio: novoEstagio });
  } catch (error) {
    console.error('Erro ao criar estágio:', error);
    res.status(500).json({ error: 'Erro ao criar estágio.' });
  }
});

// Rota para listar todos os estágios
router.get('/', async (req, res) => {
  try {
    const estagios = await Estagio.findAll();
    res.status(200).json(estagios);
  } catch (error) {
    console.error('Erro ao listar estágios:', error);
    res.status(500).send('Erro ao listar estágios');
  }
});

// Rota para atualizar informações do estágio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;
    const [updated] = await Estagio.update(
      { estudante, orientador, empresa, agenteIntegracao },
      { where: { id } }
    );
    if (updated) {
      const updatedEstagio = await Estagio.findByPk(id);
      res.status(200).json(updatedEstagio);
    } else {
      res.status(404).send('Estágio não encontrado');
    }
  } catch (error) {
    console.error('Erro ao atualizar estágio:', error);
    res.status(500).send('Erro ao atualizar estágio');
  }
});

// Rota para excluir um estágio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Estagio.destroy({ where: { id } });
    res.status(200).send('Estágio deletado');
  } catch (error) {
    console.error('Erro ao excluir estágio:', error);
    res.status(500).send('Erro ao excluir estágio');
  }
});

// Função para enviar o PDF ao Azure Blob e gerar o SAS Token
router.post('/:id/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const { id } = req.params;

    const estagio = await Estagio.findByPk(id);
    if (!estagio) {
      return res.status(404).send('Estágio não encontrado');
    }

    if (req.file) {
      const blobName = `estagios/${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Fazer o upload do PDF para o Blob Storage
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype }
      });

      // Gerar o token SAS válido por 1 hora
      const expiryTime = new Date(new Date().valueOf() + 3600 * 1000);
      const { generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');

      const sharedKeyCredential = new (require('@azure/storage-blob').StorageSharedKeyCredential)(
        process.env.AZURE_STORAGE_ACCOUNT_NAME,
        process.env.AZURE_STORAGE_ACCOUNT_KEY
      );

      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        expiresOn: expiryTime
      }, sharedKeyCredential).toString();

      const pdfUrl = `${blockBlobClient.url}?${sasToken}`;

      estagio.pdfUrl = pdfUrl;
      await estagio.save();

      res.status(200).json({ message: 'PDF enviado com sucesso', pdfUrl });
    } else {
      res.status(400).send('Nenhum arquivo enviado');
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error.message);
    res.status(500).send('Erro ao enviar o PDF');
  }
});


module.exports = router;
