const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const dotenv = require('dotenv');
const realtimeDB = require('../database/firebaseConfig'); // Importa a instância do Firebase
const router = express.Router();

// Configuração do multer
const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'estagios';
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Rota para criar um novo estágio
router.post('/api/estagios', async (req, res) => {
  const { estudante, orientador, empresa, agenteIntegracao } = req.body;

  try {
    // Criação de um novo estágio no Firebase
    const estagiosRef = realtimeDB.ref('estagios');
    const novoEstagio = {
      estudante,
      orientador,
      empresa,
      agenteIntegracao,
      pdfUrl: null, // Campo para armazenar o link do PDF
    };

    const estagioRef = await estagiosRef.push(novoEstagio);
    res.status(201).json({ message: 'Estágio criado com sucesso!', id: estagioRef.key, ...novoEstagio });
  } catch (error) {
    console.error('Erro ao criar estágio:', error);
    res.status(500).json({ error: 'Erro ao criar estágio.' });
  }
});

// Rota para criar um novo estudante
router.post('/api/estudante', async (req, res) => {
  const { nome, orientador, matricula, email } = req.body;

  try {
    // Criação de um novo estudante no Firebase
    const estudanteRef = realtimeDB.ref('estudante');
    const novoEstudante = {
      nome,
      orientador,
      matricula,
      email,
    };

    const novoEstudanteRef = await estudanteRef.push(novoEstudante);
    res.status(201).json({ message: 'Estudante cadastrado com sucesso!', id: novoEstudanteRef.key, ...novoEstudante });
  } catch (error) {
    console.error('Erro ao criar Estudante:', error);
    res.status(500).json({ error: 'Erro ao criar Estudante.' });
  }
});

// Rota para criar um novo orientador
router.post('/api/orientador', async (req, res) => {
  const { nome, email, telefone } = req.body;

  try {
    // Criação de um novo orientador no Firebase
    const orientadorRef = realtimeDB.ref('orientador');
    const novoOrientador = {
      nome,
      email,
      telefone,
    };

    const novoOrientadorRef = await orientadorRef.push(novoOrientador);
    res.status(201).json({ message: 'Orientador cadastrado com sucesso!', id: novoOrientadorRef.key, ...novoOrientador });
  } catch (error) {
    console.error('Erro ao criar Orientador:', error);
    res.status(500).json({ error: 'Erro ao criar Orientador.' });
  }
});



// Rota para listar todos os estágios
router.get('/', async (req, res) => {
  try {
    const estagiosRef = realtimeDB.ref('estagios');
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
});

// Rota para atualizar informações do estágio
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { estudante, orientador, empresa, agenteIntegracao } = req.body;

  try {
    const estagiosRef = realtimeDB.ref(`estagios/${id}`);
    const snapshot = await estagiosRef.once('value');
    const estagio = snapshot.val();

    if (!estagio) {
      return res.status(404).send('Estágio não encontrado');
    }

    await estagiosRef.update({
      estudante,
      orientador,
      empresa,
      agenteIntegracao,
    });

    res.status(200).json({ id, estudante, orientador, empresa, agenteIntegracao });
  } catch (error) {
    console.error('Erro ao atualizar estágio:', error);
    res.status(500).send('Erro ao atualizar estágio');
  }
});

// Rota para excluir um estágio
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const estagiosRef = realtimeDB.ref(`estagios/${id}`);
    const snapshot = await estagiosRef.once('value');
    const estagio = snapshot.val();

    if (!estagio) {
      return res.status(404).send('Estágio não encontrado');
    }

    await estagiosRef.remove();
    res.status(200).send('Estágio deletado');
  } catch (error) {
    console.error('Erro ao excluir estágio:', error);
    res.status(500).send('Erro ao excluir estágio');
  }
});

// Função para enviar o PDF ao Azure Blob e atualizar o link no Firebase
router.post('/:id/upload-pdf', upload.single('pdf'), async (req, res) => {
  const { id } = req.params;

  try {
    const estagiosRef = realtimeDB.ref(`estagios/${id}`);
    const snapshot = await estagiosRef.once('value');
    const estagio = snapshot.val();

    if (!estagio) {
      return res.status(404).send('Estágio não encontrado');
    }

    if (req.file) {
      const blobName = `estagios/${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Fazer o upload do PDF para o Blob Storage
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });

      // Gerar o link do PDF
      const pdfUrl = `${blockBlobClient.url}`;

      // Atualizando o link do PDF no Firebase
      await estagiosRef.update({ pdfUrl });

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
