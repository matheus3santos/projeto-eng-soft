"use client";

import { useEffect, useState } from "react";
import styles from "../css/estagio.module.css";
import Header from "@/components/headerBar";
import EditForm from "@/components/editTemplate";



// Definindo o tipo Estagio
type Estagio = {
  id: number; // Caso o ID não seja retornado, remova ou ajuste
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao?: string; // Agente de integração pode ser opcional
};


export default function Estagio() {
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEstagio, setEditingEstagio] = useState<Estagio | null>(null);


  // Função para buscar os estágios da API
  useEffect(() => {
    async function fetchEstagios() {
      try {
        const response = await fetch("http://localhost:3001/api/estagios");
        if (!response.ok) {
          throw new Error("Erro ao buscar estágios");
        }
        const data = await response.json();
        setEstagios(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEstagios();
  }, []);


  // Função para deletar o estágio
  const deleteEstagio = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/estagios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar estágio");
      }

      alert("Estágio deletado com sucesso!");
      // Após a exclusão, você pode fazer algo como atualizar a lista de estágios
      // para refletir a remoção
    } catch (err) {
      console.error("Erro:", err);
      alert("Houve um erro ao tentar deletar o estágio.");
    }
  };

  useEffect(() => {
    // Fetch de dados dos estágios
    const fetchEstagios = async () => {
      const response = await fetch("http://localhost:3001/estagios");
      const data = await response.json();
      setEstagios(data);
    };

    fetchEstagios();
  }, []);

  const handleEdit = (estagio: Estagio) => {
    setEditingEstagio(estagio); // Ativa o formulário de edição
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/api/estagios/${id}`, {
      method: "DELETE",
    });
    setEstagios(estagios.filter((estagio) => estagio.id !== id)); // Atualiza a lista após a exclusão
  };

  const handleUpdate = async (editedEstagio: Estagio) => {
    const response = await fetch(`http://localhost:3001/api/estagios/${editedEstagio.id}`, {
      method: "PUT", // ou "PATCH"
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedEstagio),
    });

    if (response.ok) {
      setEstagios(estagios.map((estagio) => (estagio.id === editedEstagio.id ? editedEstagio : estagio)));
      setEditingEstagio(null); // Fecha o formulário de edição
    }
  };

  const handleCloseEditForm = () => {
    setEditingEstagio(null); // Fecha o formulário de edição sem salvar
  };



  return (
    <div>
      <Header />

      <h1>Lista de Estágios</h1>

      {/* Exibe estado de carregamento */}
      {loading && <p>Carregando estágios...</p>}

      {/* Exibe erro, se ocorrer */}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {/* Exibe lista de estágios */}
      {!loading && !error && (
        <>
          {estagios.length === 0 ? (
            <p>Não há estágios cadastrados.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudante</th>
                  <th>Orientador</th>
                  <th>Empresa</th>
                  <th>Agente de Integração</th>
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
                      <button onClick={() => handleEdit(estagio)}>Editar</button>

                      <button onClick={() => deleteEstagio(estagio.id)}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


          )}
        </>
      )}

      {/* Se houver um estagio em edição, exibe o formulário */}
      {editingEstagio && (
        <EditForm
          estagio={editingEstagio}
          onEdit={handleUpdate}
          onClose={handleCloseEditForm}
        />
      )}
    </div>
  );
}
