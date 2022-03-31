const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
var app = express()
const MqttConnector = require('./mqtt/model/MqttConnector')
const swaggerUi = require('swagger-ui-express')
const JSONContract = require('./contract.json')
const House = require('./http/model/House')
const { hash } = require('./http/controller/utils')

// Injects .env file in process.env
require('dotenv').config()
const PORT = process.env.SERVER_PORT || 80
// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const appRoot = '/leavemealone'
// Set up API routes
app.use(`${appRoot}/user`, require('./http/routes/user'))
app.use(`${appRoot}/object`, require('./http/routes/object'))
app.use(`${appRoot}/docs`, swaggerUi.serve, swaggerUi.setup(JSONContract))

async function main() {
  console.log('Connecting to mongoDB...')
  await mongoose.connect(process.env.MONGODB_URL)
  console.log('Connected to MongoDB')
  console.log(await House.findOne({}))
  console.log(hash('test'))
  app.listen(PORT, () => {
    console.log(`OK -- Server started on port ${PORT}`)
    MqttConnector.connectAndSubscribe()
  })
}
main()