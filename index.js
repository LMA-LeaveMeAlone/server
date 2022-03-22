const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
var app = express()
const MqttConnector = require('./mqtt/model/MqttConnector')

// Injects .env file in process.env
require('dotenv').config()
const PORT = process.env.SERVER_PORT || 80
// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const appRoot = '/leavemealone'
// Set up API routes
app.use(`${appRoot}/user`, require('./http/routes/user'))
app.use(`${appRoot}/spotlight`, require('./http/routes/spotlight'))
app.use(`${appRoot}/alarm`, require('./http/routes/alarm'))

async function main() {
  console.log('Connecting to mongoDB...')
  await mongoose.connect(process.env.MONGODB_URL)
  console.log('Connected to MongoDB')
  
  app.listen(PORT || 80, () => {
    console.log(`OK -- Server started on port ${PORT}`)
    MqttConnector.connectAndSubscribe()
  })
}
main()