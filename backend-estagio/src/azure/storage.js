const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Inicializando o Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../firebase/serviceAccountKey.json')),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

module.exports = {
  bucket,
};
