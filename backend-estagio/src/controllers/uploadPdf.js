const { PDFLink, Estagio } = require("../models");
const { bucket } = require('../azure/storage');  // Firebase Storage

exports.uploadPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const estagio = await Estagio.findByPk(id);
    if (!estagio) return res.status(404).send('Estágio não encontrado');

    if (req.file) {
      const blobName = `estagios/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(blobName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.error('Erro ao fazer upload do arquivo:', err);
        res.status(500).send("Erro ao fazer upload do PDF");
      });

      stream.on('finish', async () => {
        // Arquivo carregado, agora gerar o URL de acesso
        const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // Salvar o link na tabela PDFLinks
        await PDFLink.create({
          estagioId: id,
          urlPdf: pdfUrl,
        });

        res.status(200).json({ message: "PDF enviado", pdfUrl });
      });

      stream.end(req.file.buffer);
    }
  } catch (err) {
    console.error("Erro ao fazer upload do PDF:", err);
    res.status(500).send("Erro ao fazer upload do PDF");
  }
};
