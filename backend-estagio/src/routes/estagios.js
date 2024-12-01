const express = require('express');
const router = express.Router();
const estagioController = require('../controllers/estagioController');

// CRUD para estágios
router.get('/', estagioController.listar);
router.post('/', estagioController.criar);
router.put('/:id', estagioController.editar);
router.delete('/:id', estagioController.deletar);

module.exports = router;
