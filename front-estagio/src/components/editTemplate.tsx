import React, { useState } from 'react';

interface Estagio {
  id: number;
  estudante: string;
  orientador: string;
  empresa: string;
  agenteIntegracao: string | null;
}

interface EditFormProps {
  estagio: Estagio;
  onEdit: (editedEstagio: Estagio) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData); // Passa os dados alterados para o componente pai
  };

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Estudante:</label>
          <input
            type="text"
            name="estudante"
            value={formData.estudante}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Orientador:</label>
          <input
            type="text"
            name="orientador"
            value={formData.orientador}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Empresa:</label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Agente de Integração:</label>
          <input
            type="text"
            name="agenteIntegracao"
            value={formData.agenteIntegracao || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onClose}>Fechar</button>
      </form>
    </div>
  );
};

export default EditForm;
