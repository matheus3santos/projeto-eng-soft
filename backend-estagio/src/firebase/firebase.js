//src/firebase/firebase.js

const admin = require("firebase-admin");

// Insira o arquivo de credenciais gerado no Firebase Console
const serviceAccount = require("./eng-soft-ifpe-jab-fea46cb758ee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eng-soft-ifpe-jab-default-rtdb.firebaseio.com/", // Substitua pela URL do seu banco no Firebase
});

const database = admin.database();

export default database;
