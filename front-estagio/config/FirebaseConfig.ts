import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

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

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando a autenticação com persistência no navegador
const auth = getAuth(app);

// Definindo a persistência
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Erro ao configurar a persistência de autenticação:", error);
});

export { app, auth };
