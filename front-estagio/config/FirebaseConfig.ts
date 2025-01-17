import { initializeApp, getApps, getApp } from "firebase/app";
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

const firebaseConfigStorage = {
  apiKey: "AIzaSyAx5D5PeFmbRFb5suBmzzDd1O1LYEx05gg",
  authDomain: "storage-app-111a9.firebaseapp.com",
  projectId: "storage-app-111a9",
  storageBucket: "storage-app-111a9.appspot.com",
  messagingSenderId: "893078971400",
  appId: "1:893078971400:web:efaffc4b5a687bf1b2ddbd",
  measurementId: "G-Q4C0XS8F7B"
};

// Inicializando o Firebase App para Banco de Dados e Autenticação
const app = getApps().find((app) => app.name === "[DEFAULT]") || initializeApp(firebaseConfig);

// Inicializando o Firebase App para Storage
const appStorage =
  getApps().find((app) => app.name === "storageApp") || initializeApp(firebaseConfigStorage, "storageApp");

// Inicializando os serviços de autenticação
const auth = getAuth(app);
const authStorage = getAuth(appStorage);


export { app, auth, appStorage, authStorage };
