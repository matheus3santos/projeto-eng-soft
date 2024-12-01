const Estagio = require('../models/Estagio');

exports.listar = async (req, res) => {
  try {
    const estagios = await Estagio.findAll();
    res.json(estagios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar estágios.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const novoEstagio = await Estagio.create(req.body);
    res.status(201).json(novoEstagio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar estágio.' });
  }
};

exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Estagio.update(req.body, { where: { id } });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar estágio.' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    await Estagio.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar estágio.' });
  }
};
