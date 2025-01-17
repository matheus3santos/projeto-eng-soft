'use client';

import React, { useState } from "react";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuZ-ddcuwpUqQTB0Sa3Fh52JaeKmg2MBU",
  authDomain: "eng-soft-ifpe-jab.firebaseapp.com",
  projectId: "eng-soft-ifpe-jab",
  storageBucket: "eng-soft-ifpe-jab.appspot.com",
  messagingSenderId: "518714748802",
  appId: "1:518714748802:web:d2f31ec507fd6d0dec699b",
  measurementId: "G-SMCJBC3QG3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    // Permitir que o usuário escolha a conta manualmente
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const auth = getAuth();
      await signInWithRedirect(auth, provider);

      // O resultado será tratado após o redirecionamento
      const result = await getRedirectResult(auth);
      if (result) {
        const loggedInUser = result.user;

        // Verificar se o email autenticado corresponde ao email digitado
        if (loggedInUser.email !== email) {
          alert("O email digitado não corresponde ao email autenticado.");
          await signOut(auth);
          setUser(null);
          return;
        }

        // Redirecionar com base no tipo de conta
        if (email.endsWith("@ifpe.discente.edu.br")) {
          alert("Bem-vindo, Admin!");
          window.location.href = "/admin-dashboard";
        } else if (email.endsWith("@mail.com")) {
          alert("Bem-vindo, Orientador!");
          window.location.href = "/orientador-dashboard";
        } else {
          alert("Acesso não autorizado.");
          await signOut(auth);
          setUser(null);
        }
      } else {
        console.log("Nenhum resultado de login foi encontrado.");
      }
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      {user ? (
        <div>
          <p>Bem-vindo, {user.displayName}</p>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGoogleLogin();
          }}
          style={styles.form}
        >
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />

            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />

          </div>
          <button type="submit" style={styles.button}>
            Login com Google
          </button>
        </form>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;
