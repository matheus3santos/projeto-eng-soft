import { useState } from "react";

interface UploadPDFProps {
  idEstagio: number;
  onUploadComplete: (pdfUrl: string) => void;
}

const UploadPDF = ({ idEstagio, onUploadComplete }: UploadPDFProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
      const response = await fetch(
        `http://localhost:3001/api/estagios/${idEstagio}/upload-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("PDF enviado com sucesso!");
        onUploadComplete(result.pdfUrl);
      } else {
        alert("Erro ao enviar o PDF.");
      }
    } catch (error) {
      console.error("Erro no envio do PDF:", error);
      alert("Erro ao enviar o arquivo.");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar PDF</button>
    </div>
  );
};

export default UploadPDF;
