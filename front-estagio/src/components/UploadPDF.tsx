import { useState } from "react";

interface UploadPDFProps {
  idEstagio: number;
  onUploadComplete: (pdfUrl: string) => void;
}

const UploadPDF = ({ idEstagio, onUploadComplete }: UploadPDFProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Por favor, envie apenas arquivos PDF.");
        return;
      }
      setFile(selectedFile);
      console.log("Arquivo selecionado:", selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, adicione um arquivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setIsUploading(true);
      console.log("Enviando o PDF...");

      const response = await fetch(
        `http://localhost:3001/api/estagios/${idEstagio}/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const textResponse = await response.text();  // Obtém a resposta como texto

      console.log("Resposta do servidor:", textResponse);

      if (response.ok) {
        try {
          const result = JSON.parse(textResponse);
          if (result.pdfUrl) {
            alert("PDF enviado com sucesso!");
            onUploadComplete(result.pdfUrl);
          } else {
            alert("Erro inesperado no formato da resposta.");
          }
        } catch (jsonError) {
          console.error("Erro ao parsear o JSON:", jsonError);
          alert("Erro ao enviar o PDF.");
        }
      } else {
        console.error("Erro ao enviar o PDF:", textResponse);
        alert("Erro ao enviar o PDF.");
      }
    } catch (error) {
      console.error("Erro no envio do PDF:", error);
      alert("Erro ao enviar o arquivo PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadPDF = async (idEstagio: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/estagios/${idEstagio}/upload-pdf`);
      const result = await response.json();

      if (result?.pdfUrl) {
        window.open(result.pdfUrl, '_blank');  // Abre o PDF em uma nova aba
      }
    } catch (err: any) {
      console.error('Erro ao acessar o PDF:', err.message);
    }
  };


  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Enviando..." : "Enviar PDF"}
      </button>


    </div>
  );
};

export default UploadPDF;
