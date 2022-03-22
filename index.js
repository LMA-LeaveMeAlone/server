const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
var app = express()
const MQTTSubscribe = require('./mqtt/subscribe')

// Injects .env file in process.env
require('dotenv').config()
const PORT = process.env.SERVER_PORT || 80
// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Set up API routes
app.use('/leavemealone/users', require('./http/routes/users'))

async function main() {
  console.log('Connecting to mongoDB...')
  await mongoose.connect(process.env.MONGODB_URL)
  console.log('Connected to MongoDD')
  
  app.listen(PORT || 80, () => {
    console.log(`OK -- Server started on port ${PORT}`)
    MQTTSubscribe()
  })
}
main()