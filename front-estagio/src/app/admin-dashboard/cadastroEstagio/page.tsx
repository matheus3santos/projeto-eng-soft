'use client';

import { useState, useEffect } from "react";
import Header from "@/components/headerBar";
import styles from "../../../css/estagio.module.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

type Estudante = {
  id: string;
  nome: string;
  turno: string;
  turma: string;
  email: string;
};

type Orientador = {
  id: string;
  nome: string;
  email: string;
  turno: string;
};

type Estagio = {
  id: string;
  estudanteId: string;
  orientadorId: string;
  empresa: string;
  agenteIntegracao?: string;
  pdfUrl?: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyDuZ-ddcuwpUqQTB0Sa3Fh52JaeKmg2MBU",
  authDomain: "eng-soft-ifpe-jab.firebaseapp.com",
  databaseURL: "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com",
  projectId: "eng-soft-ifpe-jab",
  storageBucket: "eng-soft-ifpe-jab.firebasestorage.app",
  messagingSenderId: "518714748802",
  appId: "1:518714748802:web:d2f31ec507fd6d0dec699b",
  measurementId: "G-SMCJBC3QG3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Estagio() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [orientadores, setOrientadores] = useState<Orientador[]>([]);
  const [estagios, setEstagios] = useState<Estagio[]>([]);

  const [newEstudante, setNewEstudante] = useState<Partial<Estudante>>({});
  const [newOrientador, setNewOrientador] = useState<Partial<Orientador>>({});
  const [newEstagio, setNewEstagio] = useState<Partial<Estagio>>({});

  const fetchData = async (path: string, setter: Function) => {
    try {
      const dataRef = ref(database, path);
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setter(dataArray);
      } else {
        setter([]);
      }
    } catch (error) {
      console.error(`Erro ao buscar dados de ${path}:`, error);
    }
  };

  useEffect(() => {
    fetchData("estudantes", setEstudantes);
    fetchData("orientadores", setOrientadores);
    fetchData("estagios", setEstagios);
  }, []);

  const handleAddData = async (path: string, data: any, setter: Function) => {
    try {
      const newId = Date.now().toString();
      const dataRef = ref(database, `${path}/${newId}`);
      await set(dataRef, data);
      setter((prev: any[]) => [...prev, { id: newId, ...data }]);
    } catch (error) {
      console.error(`Erro ao adicionar em ${path}:`, error);
    }
  };

  const handleDeleteEstagio = async (id: string) => {
    try {
      const dataRef = ref(database, `estagios/${id}`);
      await remove(dataRef);
      setEstagios((prev) => prev.filter((estagio) => estagio.id !== id));
    } catch (error) {
      console.error("Erro ao deletar estágio:", error);
    }
  };

  return (
    <div>
      <Header />
      <h1>Cadastro de Estágio</h1>

      {/* Cadastro de Estudante */}
      <h2>Cadastrar Estudante</h2>
      <input placeholder="Nome" onChange={(e) => setNewEstudante({ ...newEstudante, nome: e.target.value })} />
      <input placeholder="Turno" onChange={(e) => setNewEstudante({ ...newEstudante, turno: e.target.value })} />
      <input placeholder="Turma" onChange={(e) => setNewEstudante({ ...newEstudante, turma: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setNewEstudante({ ...newEstudante, email: e.target.value })} />
      <button onClick={() => handleAddData("estudantes", newEstudante, setEstudantes)}>Cadastrar Estudante</button>

      {/* Cadastro de Orientador */}
      <h2>Cadastrar Orientador</h2>
      <input placeholder="Nome" onChange={(e) => setNewOrientador({ ...newOrientador, nome: e.target.value })} />
      <input placeholder="Turno" onChange={(e) => setNewOrientador({ ...newOrientador, turno: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setNewOrientador({ ...newOrientador, email: e.target.value })} />
      <button onClick={() => handleAddData("orientadores", newOrientador, setOrientadores)}>Cadastrar Orientador</button>

      {/* Cadastro de Estágio */}
      <h2>Cadastrar Estágio</h2>
      <select onChange={(e) => setNewEstagio({ ...newEstagio, estudanteId: e.target.value })}>
        <option value="">Selecione um Estudante</option>
        {estudantes.map((estudante) => (
          <option key={estudante.id} value={estudante.id}>
            {estudante.nome}
          </option>
        ))}
      </select>
      <select onChange={(e) => setNewEstagio({ ...newEstagio, orientadorId: e.target.value })}>
        <option value="">Selecione um Orientador</option>
        {orientadores.map((orientador) => (
          <option key={orientador.id} value={orientador.id}>
            {orientador.nome}
          </option>
        ))}
      </select>
      <input placeholder="Empresa" onChange={(e) => setNewEstagio({ ...newEstagio, empresa: e.target.value })} />
      <input placeholder="Agente de Integração" onChange={(e) => setNewEstagio({ ...newEstagio, agenteIntegracao: e.target.value })} />
      <button onClick={() => handleAddData("estagios", newEstagio, setEstagios)}>Cadastrar Estágio</button>

      {/* Lista de Estágios */}
      <h2>Estágios Cadastrados</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Estudante</th>
            <th>Orientador</th>
            <th>Empresa</th>
            <th>Agente Integração</th>
          </tr>
        </thead>
        <tbody>
          {estagios.map((estagio) => {
            const estudante = estudantes.find((e) => e.id === estagio.estudanteId);
            const orientador = orientadores.find((o) => o.id === estagio.orientadorId);

            return (
              <tr key={estagio.id}>
                <td>{estudante?.nome || "Desconhecido"}</td>
                <td>{orientador?.nome || "Desconhecido"}</td>
                <td>{estagio.empresa}</td>
                <td>{estagio.agenteIntegracao || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
