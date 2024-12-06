'use client';

import { useEffect, useState } from "react";
import Header from "@/components/headerBar";
import styles from "./css/estagio.module.css";
import io, { Socket } from 'socket.io-client'; // Importa o socket.io-client
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";


type Estagio = {
  id: number;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao?: string;
  pdfUrl?: string; // URL do PDF armazenado
};

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SUA_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SUA_MESSAGING_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const listenToEstagios = (callback: (estagios: Estagio[]) => void) => {
  const estagiosRef = ref(database, "estagios");
  onValue(estagiosRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
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
    pdf: null as File | null, // Armazena o arquivo PDF
  });
  const [message, setMessage] = useState("");
  const [highlightedId, setHighlightedId] = useState<number | null>(null); // ID do estágio destacado

  // Função para atualizar os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Função para atualizar o campo de upload de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, pdf: e.target.files[0] });
    }
  };

  // Função para enviar os dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uploadData = {
      estudante: formData.estudante,
      orientador: formData.orientador,
      empresa: formData.empresa,
      agenteIntegracao: formData.agenteIntegracao,
    };

    try {
      const response = await fetch("http://localhost:3001/api/estagios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData), // Envia os dados no formato JSON
      });

      if (response.ok) {
        const novoEstagio = await response.json();
        setMessage("Estágio cadastrado com sucesso!");
        setEstagios((prevEstagios) => [novoEstagio, ...prevEstagios]);
        setHighlightedId(novoEstagio.id);

        setTimeout(() => setHighlightedId(null), 3000);
        setFormData({
          estudante: "",
          orientador: "",
          empresa: "",
          agenteIntegracao: "",
          pdf: null,
        });
      } else {
        setMessage("Erro ao cadastrar o estágio. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setMessage("Erro ao enviar os dados ao servidor.");
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

  // WebSocket para atualizações em tempo real
  useEffect(() => {
    const socket: Socket = io('http://localhost:3001'); // Configura o socket.io

    // Escuta eventos para criação, atualização e exclusão de estágios
    socket.on('estagio criado', (novoEstagio) => {
      setEstagios((prevEstagios) => [novoEstagio, ...prevEstagios]);
    });

    socket.on('estagio atualizado', (updatedEstagio) => {
      setEstagios((prevEstagios) =>
        prevEstagios.map((estagio) =>
          estagio.id === updatedEstagio.id ? updatedEstagio : estagio
        )
      );
    });

    socket.on('estagio deletado', (id) => {
      setEstagios((prevEstagios) => prevEstagios.filter((estagio) => estagio.id !== id));
    });

    // Função de limpeza para desconectar o socket ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    listenToEstagios(setEstagios);
  }, []);

  return (
    <div>
      <div>
        <Header />
      </div>

      <div style={{ padding: "1rem" }}>
        <h1>Cadastro de Estágio</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}
        >
          <input
            type="text"
            name="estudante"
            placeholder="Estudante"
            value={formData.estudante}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="orientador"
            placeholder="Orientador"
            value={formData.orientador}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="empresa"
            placeholder="Empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="agenteIntegracao"
            placeholder="Agente de Integração"
            value={formData.agenteIntegracao}
            onChange={handleChange}
          />

          <button type="submit">Cadastrar Estágio</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div style={{ padding: "1rem" }}>
        <h1>Lista de Estágios</h1>
        {loading && <p>Carregando estágios...</p>}
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        {!loading && !error && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudante</th>
                <th>Orientador</th>
                <th>Empresa</th>
                <th>Agente de Integração</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {estagios.map((estagio) => (
                <tr
                  key={estagio.id}
                  className={highlightedId === estagio.id ? styles.highlight : ""}
                >
                  <td>{estagio.id}</td>
                  <td>{estagio.estudante}</td>
                  <td>{estagio.orientador}</td>
                  <td>{estagio.empresa}</td>
                  <td>{estagio.agenteIntegracao || "N/A"}</td>
                  <td>
                    {estagio.pdfUrl ? (
                      <a href={estagio.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Visualizar PDF
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
