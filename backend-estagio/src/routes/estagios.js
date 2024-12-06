const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');
const { Estagio } = require('../models/Estagio'); // Certifique-se de que o caminho está correto

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'estagios';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

const router = express.Router();

// Configuração do multer
const upload = multer({ storage: multer.memoryStorage() });

// Rota para criar um novo estágio
router.post('/', async (req, res) => {
  try {
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;
    const novoEstagio = await Estagio.create({ estudante, orientador, empresa, agenteIntegracao });
    res.status(201).json(novoEstagio);
  } catch (error) {
    console.error('Erro ao criar estágio:', error);
    res.status(500).send('Erro ao criar estágio');
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

// Função para enviar o PDF ao Azure Blob
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

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype }
      });

      const pdfUrl = `${containerClient.url}/${blobName}`;

      estagio.pdfUrl = pdfUrl;
      await estagio.save();

      res.status(200).json({ message: 'PDF enviado com sucesso', pdfUrl });
    } else {
      res.status(400).send('Nenhum arquivo enviado');
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).send('Erro ao enviar o PDF');
  }
});

module.exports = router;
