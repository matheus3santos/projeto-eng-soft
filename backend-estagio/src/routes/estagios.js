const express = require('express');
const { criarEstagio, listarEstagios, atualizarEstagio, excluirEstagio } = require('../controllers/estagioController');


const router = express.Router();

// Rota para criar um novo estágio
router.post('/', criarEstagio);

// Rota para listar todos os estágios
router.get('/', listarEstagios);

// Rota para atualizar um estágio (PUT)
router.put('/:id', atualizarEstagio);

// Rota para excluir um estágio (DELETE)
router.delete('/:id', excluirEstagio);

module.exports = router;
