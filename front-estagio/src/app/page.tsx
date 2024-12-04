'use client';
import styles from "./css/page.module.css";
import Link from "next/link";
import Header from "@/components/headerBar";



import { useState } from "react";

export default function Estagio() {
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

  return (
    <div style={{ padding: " " }}>

      <Header />


      <div style={{ padding: "2rem" }}>
        <h1>Cadastro de Estágio</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
          <div>
            <label htmlFor="estudante">ID do Estudante:</label>
            <input
              type="text"
              id="estudante"
              name="estudante"
              value={formData.estudante}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="orientador">ID do Orientador:</label>
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
            <label htmlFor="empresa">ID da Empresa:</label>
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

    </div>
  );
}
