//src/controlles/uploadPdf.js é um controller que faz o upload do PDF do estágio para o Azure Blob Storage e salva o link na tabela PDFLinks

const { PDFLink, Estagio } = require("../models");
const { containerClient } = require('../azure/storage');


exports.uploadPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const estagio = await Estagio.findByPk(id);
    if (!estagio) return res.status(404).send('Estágio não encontrado');

    if (req.file) {
      const blobName = `estagios/${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { blobContentType: req.file.mimetype },
      });

      const pdfUrl = `${containerClient.url}/${blobName}`;

      // Salvar o link na tabela PDFLinks
      const linkPdf = await PDFLink.create({
        estagioId: id,
        urlPdf: pdfUrl,
      });

      res.status(200).json({ message: "PDF enviado", pdfUrl });
    }
  } catch (err) {
    console.error("Erro ao fazer upload do PDF:", err);
    res.status(500).send("Erro ao fazer upload do PDF");
  }
};
