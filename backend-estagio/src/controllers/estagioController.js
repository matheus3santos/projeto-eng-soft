const Estagio = require('../models/Estagio');

// Criar um novo estágio
const criarEstagio = async (req, res) => {
  try {
    const { estudante, orientador, empresa, agenteIntegracao } = req.body;
    const novoEstagio = await Estagio.create({ estudante, orientador, empresa, agenteIntegracao });
    res.status(201).json(novoEstagio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os estágios
const listarEstagios = async (req, res) => {
  try {
    const estagios = await Estagio.findAll();
    res.status(200).json(estagios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um estágio (PUT)
const atualizarEstagio = async (req, res) => {
  const { id } = req.params; // ID do estágio a ser atualizado
  const { estudante, orientador, empresa, agenteIntegracao } = req.body;

  try {
    const estagio = await Estagio.findByPk(id);

    if (!estagio) {
      return res.status(404).json({ message: 'Estágio não encontrado' });
    }

    // Atualizar os dados do estágio
    estagio.estudante = estudante || estagio.estudante;
    estagio.orientador = orientador || estagio.orientador;
    estagio.empresa = empresa || estagio.empresa;
    estagio.agenteIntegracao = agenteIntegracao || estagio.agenteIntegracao;

    await estagio.save();

    res.status(200).json({ message: 'Estágio atualizado com sucesso', estagio });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar estágio', error });
  }
};

// Excluir um estágio (DELETE)
const excluirEstagio = async (req, res) => {
  const { id } = req.params; // ID do estágio a ser deletado

  try {
    const estagio = await Estagio.findByPk(id);

    if (!estagio) {
      return res.status(404).json({ message: 'Estágio não encontrado' });
    }

    // Deletar o estágio
    await estagio.destroy();

    res.status(200).json({ message: 'Estágio excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir estágio', error });
  }
};

module.exports = { criarEstagio, listarEstagios, atualizarEstagio, excluirEstagio };
