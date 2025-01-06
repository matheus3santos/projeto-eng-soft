"use client";

import { useEffect, useState } from "react";
import Header from "@/components/headerBar";
import EditForm from "@/components/editForm";
import UploadPDF from "@/components/UploadPDF";
import styles from "../css/estagio.module.css";

type Estagio = {
  id: number;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao: string | null;  // Alterado para string | null
  pdfUrl?: string;
};

export default function Estagio() {
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEstagio, setEditingEstagio] = useState<Estagio | null>(null);

  // Buscar os estágios
  useEffect(() => {
    async function fetchEstagios() {
      try {
        const response = await fetch("http://localhost:3001/api/estagios");
        if (!response.ok) throw new Error("Erro ao buscar estágios.");
        const data = await response.json();
        setEstagios(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEstagios();
  }, []);

  // Deletar um estágio
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/estagios/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEstagios(estagios.filter((estagio) => estagio.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // Editar um estágio
  const handleEdit = (estagio: Estagio) => {
    setEditingEstagio(estagio);
  };

  const handleSaveEdit = (updatedEstagio: Estagio) => {
    setEstagios((prevEstagios) =>
      prevEstagios.map((e) => (e.id === updatedEstagio.id ? updatedEstagio : e))
    );
    setEditingEstagio(null);
  };

  const handleCloseEditForm = () => {
    setEditingEstagio(null);
  };

  const handleUploadComplete = (id: number, pdfUrl: string) => {
    console.log("PDF URL recebido:", pdfUrl);  // Adicionando log para verificar a URL
    setEstagios((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, pdfUrl } : e  // Garantindo que estamos apenas atualizando a URL do PDF
      )
    );
  };

  const handleDownloadPDF = (pdfUrl?: string) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("PDF não está disponível.");
    }
  };






    return (
      <div>
        <Header />
        <h1>Lista de Estágios</h1>

        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}

        {!loading && !error && (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudante</th>
                  <th>Orientador</th>
                  <th>Empresa</th>
                  <th>Agente Integração</th>
                  <th>PDF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {estagios.map((estagio) => (
                  <tr key={estagio.id}>
                    <td>{estagio.id}</td>
                    <td>{estagio.estudante}</td>
                    <td>{estagio.orientador}</td>
                    <td>{estagio.empresa}</td>
                    <td>{estagio.agenteIntegracao || "N/A"}</td>

                    <td>
                      {estagio.pdfUrl ? (
                        <a
                          href="#"
                          onClick={() => handleDownloadPDF(estagio.pdfUrl)}
                          rel="noopener noreferrer"
                        >
                          Visualizar PDF
                        </a>
                      ) : (
                        <UploadPDF
                          idEstagio={estagio.id}
                          onUploadComplete={(url) => handleUploadComplete(estagio.id, url)}
                        />
                      )}
                    </td>



                    <td>
                      <button onClick={() => handleEdit(estagio)}>Editar</button>
                      <button onClick={() => handleDelete(estagio.id)}>Deletar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editingEstagio && (
              <EditForm
                estagio={editingEstagio}
                onEdit={handleSaveEdit}
                onClose={handleCloseEditForm}
              />
            )}
          </>
        )}
      </div>
    );
  }
