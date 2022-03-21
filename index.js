const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var app = express()
const MQTTSubscribe = require('./mqtt/subscribe')
// Injects .env file in process.env
require('dotenv').config()

// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/leavemealone/users', require('./http/routes/users'))

app.listen(process.env.SERVER_PORT, () => {
  console.log(`OK -- Server started on port ${process.env.SERVER_PORT}`)
  MQTTSubscribe()
})