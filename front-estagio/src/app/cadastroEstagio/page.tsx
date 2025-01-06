'use client';

import { useState, useEffect } from "react";
import Header from "@/components/headerBar";
import styles from "../css/estagio.module.css";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

type Estagio = {
  id: number;
  estudante: string;
  orientador: string;
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
  const [estagiosFirebase, setEstagiosFirebase] = useState<Estagio[]>([]);
  const [firebaseData, setFirebaseData] = useState<Estagio>({ id: 0, estudante: "", orientador: "", empresa: "" });

  const handleAddToFirebase = async () => {
    try {
      const newId = Date.now(); // Geração automática de ID (timestamp)

      const firebaseRef = ref(database, `estagios/${newId}`);
      const newEstagio = { ...firebaseData, id: newId };

      await set(firebaseRef, newEstagio);
      console.log("Estágio adicionado ao Firebase.");
      setEstagiosFirebase([...estagiosFirebase, newEstagio]);
    } catch (error) {
      console.error("Erro no Firebase", error);
    }
  };



  const handleInputChangeFirebase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirebaseData({ ...firebaseData, [name]: value });
  };



  return (
    <div>
      <Header />
      <h1>Estágios</h1>

      {/* Botões */}
      <button onClick={handleAddToFirebase}>Cadastrar no Firebase</button>
      {/* <button onClick={handleAddToMySQL}>Cadastrar no MySQL</button> */}

      {/* Formulário Firebase */}
      <h2>Cadastro Firebase</h2>
      <input placeholder="Estudante" name="estudante" onChange={handleInputChangeFirebase} />
      <input placeholder="Orientador" name="orientador" onChange={handleInputChangeFirebase} />
      <input placeholder="Empresa" name="empresa" onChange={handleInputChangeFirebase} />
      <input placeholder="Agente de Integração" name="agenteIntegracao" onChange={handleInputChangeFirebase} />

      {/* Lista dos Estágios no Firebase */}
      <h2>Estágios no Firebase</h2>
      {estagiosFirebase.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudante</th>
              <th>Orientador</th>
              <th>Empresa</th>
            </tr>
          </thead>
          <tbody>
            {estagiosFirebase.map(estagio => (
              <tr key={estagio.id}>
                <td>{estagio.id}</td>
                <td>{estagio.estudante}</td>
                <td>{estagio.orientador}</td>
                <td>{estagio.empresa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
