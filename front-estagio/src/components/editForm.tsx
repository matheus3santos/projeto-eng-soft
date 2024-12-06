import React, { useState } from "react";

type Estagio = {
  id: number;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao: string | null;
}

interface EditFormProps {
  estagio: Estagio;
  onEdit: (updatedEstagio: Estagio) => void;
  onClose: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ estagio, onEdit, onClose }) => {
  const [formData, setFormData] = useState<Estagio>({ ...estagio });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/estagios/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedEstagio = await response.json();
        onEdit(updatedEstagio);
        onClose();
      } else {
        console.error("Erro ao editar o estágio.");
      }
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  return (
    <div>
      <h3>Editar Estágio</h3>
      <form onSubmit={handleSubmit}>
        <label>Estudante</label>
        <input name="estudante" value={formData.estudante} onChange={handleChange} />
        <label>Orientador</label>
        <input name="orientador" value={formData.orientador} onChange={handleChange} />
        <label>Empresa</label>
        <input name="empresa" value={formData.empresa} onChange={handleChange} />
        <label>Agente de Integração</label>
        <input name="agenteIntegracao" value={formData.agenteIntegracao || ""} onChange={handleChange} />
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Fechar</button>
      </form>
    </div>
  );
};

export default EditForm;
