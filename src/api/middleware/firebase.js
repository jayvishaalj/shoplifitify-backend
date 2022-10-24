/* eslint-disable import/no-unresolved */
const firebaseAdmin = require('firebase-admin');
const credentials = require('../../config/key.json');

// Initialize Firebase
const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credentials)
});
const db = firebaseAdmin.firestore();
module.exports.firebaseApp = firebaseApp;
module.exports.db = db;
