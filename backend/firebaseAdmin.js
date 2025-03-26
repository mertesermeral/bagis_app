const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// ✅ Firebase Admin SDK'yı başlatıyoruz
const serviceAccount = require("./serviceAccountKey.json"); //serviceAccountKey

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
