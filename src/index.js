require('dotenv').config()
const app = require('express')()
module.exports = app
const server = require('http').Server(app)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const MqttConnector = require('./mqtt/model/MqttConnector')
const swaggerUi = require('swagger-ui-express')
const JSONContract = require('./contract.json')
const { startupSocketIO } = require('./socket/socket')
// Injects .env file in process.env
const PORT = process.env.SERVER_PORT || 80
// Middlewares
app.use(require('cors')())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const appRoot = '/leavemealone'
// Set up API routes
app.use(`${appRoot}/user`, require('./http/routes/user'))
app.use(`${appRoot}/object`, require('./http/routes/object'))
app.use(`${appRoot}/record`, require('./http/routes/record'))
app.use(`${appRoot}/stream`, require('./http/routes/stream'))
app.use(`${appRoot}/docs`, swaggerUi.serve, swaggerUi.setup(JSONContract))
app.get(appRoot, (req, res) => {
  res.sendFile('test.html', { root: __dirname })
})


async function main() {
  
  try{
    console.log('Connecting to mongoDB...')
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Connected to MongoDB')
  }catch(e){
    console.error('Error when connecting to MongoDB : ', e.message)
  }
  server.listen(PORT, () => {
    console.log(`OK -- Server started on port ${PORT}`)
    process.env.ALLOW_MQTT === 'true' && MqttConnector.connectAndSubscribe()
    startupSocketIO(server)
  })
}
main()
