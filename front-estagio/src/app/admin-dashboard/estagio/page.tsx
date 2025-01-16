"use client";

import { useEffect, useState } from "react";
import Header from "@/components/headerBar";
import EditForm from "@/components/editForm";
import styles from "../../../css/estagio.module.css";

type Estudante = {
  id: string;
  nome: string;
};

type Orientador = {
  id: string;
  nome: string;
};

type Estagio = {
  id: string;
  estudanteId: string;
  orientadorId: string;
  empresa: string;
  agenteIntegracao: string | null;
  pdfUrl?: string;
};

type EstagioDisplay = {
  id: string;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao: string | null;
  pdfUrl?: string;
};

export default function Estagio() {
  const [estagios, setEstagios] = useState<EstagioDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEstagio, setEditingEstagio] = useState<EstagioDisplay | null>(null);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch Estudantes
      const estudantesResponse = await fetch(
        "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com/estudantes.json"
      );
      const estudantesData = await estudantesResponse.json();
      const estudantesMap: Record<string, string> = Object.entries(estudantesData || {}).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = value.nome;
          return acc;
        },
        {}
      );

      // Fetch Orientadores
      const orientadoresResponse = await fetch(
        "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com/orientadores.json"
      );
      const orientadoresData = await orientadoresResponse.json();
      const orientadoresMap: Record<string, string> = Object.entries(orientadoresData || {}).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = value.nome;
          return acc;
        },
        {}
      );

      // Fetch Estagios
      const estagiosResponse = await fetch(
        "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com/estagios.json"
      );
      if (!estagiosResponse.ok) throw new Error("Erro ao buscar estágios.");
      const estagiosData = await estagiosResponse.json();

      // Map Estágios para incluir os nomes correspondentes
      const estagiosArray = Object.entries(estagiosData || {}).map(([key, value]: [string, any]) => ({
        id: key,
        estudante: estudantesMap[value.estudanteId] || "Desconhecido",
        orientador: orientadoresMap[value.orientadorId] || "Desconhecido",
        empresa: value.empresa || "Não Informada",
        agenteIntegracao: value.agenteIntegracao || null,
        pdfUrl: value.pdfUrl || null,
      }));

      setEstagios(estagiosArray);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com/estagios/${id}.json`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setEstagios((prevEstagios) => prevEstagios.filter((estagio) => estagio.id !== id));
      } else {
        throw new Error("Erro ao deletar o estágio.");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleEdit = (estagio: EstagioDisplay) => {
    setEditingEstagio(estagio);
  };

  const handleSaveEdit = (updatedEstagio: EstagioDisplay) => {
    setEstagios((prevEstagios) =>
      prevEstagios.map((e) => (e.id === updatedEstagio.id ? updatedEstagio : e))
    );
    setEditingEstagio(null);
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
              onClose={() => setEditingEstagio(null)}
            />
          )}
        </>
      )}
    </div>
  );
}