'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { app, auth } from '../../../config/FirebaseConfig';
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

type Orientador = {
    id: string;
    nome: string;
    email: string;
    turno: string;
    password: string;
};

const database = getDatabase(app);

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [turno, setTurno] = useState('');
    const [password, setPassword] = useState('');
    const [orientadores, setOrientadores] = useState<Orientador[]>([]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const auth = getAuth();

        try {
            // Cadastrar no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Após sucesso no cadastro de autenticação, salvar no Realtime Database
            const newOrientador: Omit<Orientador, 'id'> = {
                nome,
                email,
                turno,
                password: '', // Opcional: Não é recomendado armazenar a senha no banco
            };

            const newId = user.uid; // Usar o UID gerado pelo Firebase Authentication
            const dataRef = ref(database, `orientadores/${newId}`);
            await set(dataRef, newOrientador);

            // Atualizar a lista local de orientadores
            setOrientadores((prev) => [
                ...prev,
                { id: newId, ...newOrientador },
            ]);

            alert('Orientador cadastrado com sucesso!');
            setNome('');
            setEmail('');
            setTurno('');
            setPassword('');
        } catch (error: any) {
            console.error("Erro ao cadastrar orientador:", error);
            alert(`Erro ao cadastrar orientador: ${error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Cadastro</h1>
            <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="name" style={styles.label}>Nome</label>
                    <input
                        type="text"
                        id="name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="turno" style={styles.label}>Turno</label>
                    <input
                        type="text"
                        id="turno"
                        value={turno}
                        onChange={(e) => setTurno(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>Cadastrar Orientador</button>
            </form>
            <p>Já tem uma conta? <Link href="/" style={styles.link}>Faça login</Link></p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    link: {
        color: '#4CAF50',
        textDecoration: 'none',
    },
};
