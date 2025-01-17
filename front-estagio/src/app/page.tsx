'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  // Login com Email e Senha
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/orientador-dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Login com Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/admin-dashboard/cadastroEstagio'); // Redireciona após login bem-sucedido
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
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
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>

      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        Entrar com Google
      </button>
      
      <p>Não tem uma conta? <Link href="/cadastro" style={styles.link}>Cadastre-se</Link></p>
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
    margin: '10px'
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
    marginBottom: '10px',
  },
  googleButton: {
    width: '20%',
    padding: '10px',
    backgroundColor: '#DB4437',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '10px',
  },
  link: {
    padding: '5px',
    color: '#4CAF50',
    textDecoration: 'none',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};
