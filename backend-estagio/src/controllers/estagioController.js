//src/controlles/estagioController.js

const Estagio = require('../models/Estagio'); // Certifique-se de que o caminho está correto
const PDFLink = require('../models/PdfLink'); // Certifique-se de que o caminho está correto

const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');
dotenv.config();



const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'estagios';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);


exports.criarEstagio = async (req, res) => {
  try {
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;
    const novoEstagio = await Estagio.create({ estudante, orientador, empresa, agenteIntegracao });
    res.status(201).json(novoEstagio);
  } catch (error) {
    console.error('Erro ao criar estágio:', error);
    res.status(500).send('Erro ao criar estágio');
  }
};

exports.listarEstagios = async (req, res) => {
  try {
    const estagios = await Estagio.findAll();
    res.status(200).json(estagios);
  } catch (error) {
    console.error('Erro ao listar estágios:', error);
    res.status(500).send('Erro ao listar estágios');
  }
};

exports.atualizarEstagio = async (req, res) => {
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
};

exports.excluirEstagio = async (req, res) => {
  try {
    const { id } = req.params;
    await Estagio.destroy({ where: { id } });
    res.status(200).send('Estágio deletado');
  } catch (error) {
    console.error('Erro ao excluir estágio:', error);
    res.status(500).send('Erro ao excluir estágio');
  }
};

// Função para enviar o PDF ao Azure Blob
exports.uploadPdf = async (req, res) => {
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
};

