const firebase = require('firebase/app');
require('firebase/database'); // Realtime Database
const dotenv = require('dotenv');

const firebaseConfig = {
    apiKey: "AIzaSyDuZ-ddcuwpUqQTB0Sa3Fh52JaeKmg2MBU",
    authDomain: "eng-soft-ifpe-jab.firebaseapp.com",
    databaseURL: "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com",
    projectId: "eng-soft-ifpe-jab",
    storageBucket: "eng-soft-ifpe-jab.firebasestorage.app",
    messagingSenderId: "518714748802",
    appId: "1:518714748802:web:d2f31ec507fd6d0dec699b",
    measurementId: "G-SMCJBC3QG3"
  };

// Inicializa o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

module.exports = database;
