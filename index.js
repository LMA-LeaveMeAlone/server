const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var app = express()
// Injects .env file in process.env
require('dotenv').config()

// Middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen(process.env.SERVER_PORT, () => {
  console.log(`OK -- Server started on port ${process.env.SERVER_PORT}`)
})