require('dotenv').config()
const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const MqttConnector = require('./mqtt/model/MqttConnector')
const swaggerUi = require('swagger-ui-express')
const JSONContract = require('./contract.json')
const exec = require('child_process').exec
const fs = require('fs')
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})

const PORT = process.env.SERVER_PORT || 80
// Middlewares
app.use(require('cors')())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const appRoot = '/leavemealone'
// Set up API routes
app.use(`${appRoot}/object`, require('./http/routes/object'))
app.use(`${appRoot}/docs`, swaggerUi.serve, swaggerUi.setup(JSONContract))
app.get(appRoot, (req, res) => {
  res.sendFile('root')
})
app.get(appRoot + '/stream', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//SOCKETS

let isStreaming

io.on('connection', (socket) => {

  console.log('SOCKET -- New client connected')
  socket.on('disconnect', () => {
    console.log('SOCKET -- A client disconnected')
    stopStreaming()
  })

  socket.on('start-stream', () => {
    startStreaming(io)
  })
})

function startStreaming(io){
  console.log('STREAM -- New stream started')

  isStreaming = true

  const readStream = () => {
    exec(`raspistill -w 200 -h 200 -o ${__dirname}/stream/frame.jpg -t 100 -n`, () => {
      fs.readFile(__dirname + '/stream/frame.jpg', (err, data) => {
        io.sockets.emit('liveStream', {image: true, buffer: data.toString('base64')})
        if(isStreaming) readStream()
      })
    })
  }
  readStream()
}

function stopStreaming(){
  isStreaming = false
  console.log('STREAM -- Stream ended')
}

async function main() {
  try{
    console.log('Connecting to mongoDB...')
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Connected to MongoDB')
  }catch(e){
    console.error('Error when connecting to MongoDB : ', e.message)
  }
  http.listen(PORT, () => {
    console.log(`OK -- Server started on port ${PORT}`)
    process.env.ALLOW_MQTT === 'true' && MqttConnector.connectAndSubscribe()
  })
}
main()
