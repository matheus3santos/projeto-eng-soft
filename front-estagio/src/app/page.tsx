'use client';

import { useEffect, useState } from "react";
import io from 'socket.io-client'; // Importa o socket.io-client
import Header from "@/components/headerBar";
import styles from "./css/estagio.module.css";

type Estagio = {
  id: number;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao?: string;
};

export default function Estagio() {
  const [estagios, setEstagios] = useState<Estagio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    estudante: "",
    orientador: "",
    empresa: "",
    agenteIntegracao: "",
  });
  const [message, setMessage] = useState("");

  // Função para atualizar os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para enviar os dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/estagios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Estágio cadastrado com sucesso!");
        setFormData({
          estudante: "",
          orientador: "",
          empresa: "",
          agenteIntegracao: "",
        });
      } else {
        setMessage("Erro ao cadastrar o estágio. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      setMessage("Ocorreu um erro ao enviar os dados. Tente novamente mais tarde.");
    }
  };

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

  useEffect(() => {
    // Conecta ao servidor WebSocket
    const socket = io('http://localhost:3001');

    // Ouve pelo evento "estagio criado"
    socket.on('estagio criado', (novoEstagio) => {
      setEstagios((prevEstagios) => [novoEstagio, ...prevEstagios]);
    });

    // Ouve pelo evento "estagio atualizado"
    socket.on('estagio atualizado', (updatedEstagio) => {
      setEstagios((prevEstagios) =>
        prevEstagios.map((estagio) =>
          estagio.id === updatedEstagio.id ? updatedEstagio : estagio
        )
      );
    });

    // Ouve pelo evento "estagio deletado"
    socket.on('estagio deletado', (id) => {
      setEstagios((prevEstagios) => prevEstagios.filter((estagio) => estagio.id !== id));
    });

    // Limpa a conexão ao WebSocket ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (

    <div style={{ padding: "" }}>

      <div>
        <Header />
      </div>

      <div style={{ padding: "1rem" }}>
        <h1>Cadastro de Estágio</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
          <div>
            <label htmlFor="estudante">Estudante:</label>
            <input
              type="text"
              id="estudante"
              name="estudante"
              value={formData.estudante}
              onChange={handleChange}
              required
            />
          </div>

          <div >
            <label htmlFor="orientador">Orientador:</label>
            <input
              type="text"
              id="orientador"
              name="orientador"
              value={formData.orientador}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="empresa">Empresa:</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="agenteIntegracao">Agente de Integração:</label>
            <input
              type="text"
              id="agenteIntegracao"
              name="agenteIntegracao"
              value={formData.agenteIntegracao}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={{ backgroundColor: "#0070f3", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>
            Cadastrar Estágio
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>

      <div style={{ padding: "1rem" }}>
        <h1>Lista de Estágios</h1>
        {loading && <p>Carregando estágios...</p>}
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
