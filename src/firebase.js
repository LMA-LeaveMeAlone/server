
const admin = require('firebase-admin')

const serviceAccount = require('../private/admin-sdk.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://whoisit-475bd-default-rtdb.europe-west1.firebasedatabase.app'
})
module.exports = admin

