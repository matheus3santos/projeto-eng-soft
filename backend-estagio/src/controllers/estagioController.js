const { ref } = require('../database/firebaseConfig'); // Certifique-se de que está importando a instância correta do Firebase

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

    // Criando um novo estágio no Firebase
    const estagiosRef = ref.child('estagios');
    const novoEstagio = await estagiosRef.push({
      estudante,
      orientador,
      empresa,
      agenteIntegracao,
      pdfUrl: null // Adicionando o campo para o link do PDF
    });

    res.status(201).json({ id: novoEstagio.key, estudante, orientador, empresa, agenteIntegracao });
  } catch (error) {
    console.error('Erro ao criar estágio:', error);
    res.status(500).send('Erro ao criar estágio');
  }
};

exports.listarEstagios = async (req, res) => {
  try {
    const estagiosRef = ref.child('estagios');
    const snapshot = await estagiosRef.once('value');
    const estagios = snapshot.val();

    if (!estagios) {
      return res.status(404).send('Nenhum estágio encontrado');
    }

    const estagiosArray = Object.entries(estagios).map(([key, value]) => ({
      id: key,
      ...value
    }));

    res.status(200).json(estagiosArray);
  } catch (error) {
    console.error('Erro ao listar estágios:', error);
    res.status(500).send('Erro ao listar estágios');
  }
};

exports.atualizarEstagio = async (req, res) => {
  try {
    const { id } = req.params;
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;

    const estagiosRef = ref.child(`estagios/${id}`);

    // Atualizando o estágio no Firebase
    const updated = await estagiosRef.update({
      estudante,
      orientador,
      empresa,
      agenteIntegracao
    });

    if (updated) {
      res.status(200).json({ id, estudante, orientador, empresa, agenteIntegracao });
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
    const estagiosRef = ref.child(`estagios/${id}`);

    // Excluindo o estágio do Firebase
    await estagiosRef.remove();

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
    const estagiosRef = ref.child(`estagios/${id}`);

    const snapshot = await estagiosRef.once('value');
    const estagio = snapshot.val();

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

      // Atualizando a URL do PDF no Firebase
      await estagiosRef.update({ pdfUrl });

      res.status(200).json({ message: 'PDF enviado com sucesso', pdfUrl });
    } else {
      res.status(400).send('Nenhum arquivo enviado');
    }
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).send('Erro ao enviar o PDF');
  }
};
