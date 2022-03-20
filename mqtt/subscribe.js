const client = require('./model/MQTTClient')
const messageRoutes = require('./messageRoutes')

function subscribe() {
  client.on('connect', function () {
    console.log('OK -- Connected to MQTT client')
    client.subscribe('/sensor/movement', (err) => {
      console.log('OK -- Subscribed to /sensor/movement')
      if (err) {
        throw new Error(err.message)
      }
    })
  })
  client.on('message', (topic, message) => {
    const route = messageRoutes.find(route => route.topic === topic)
    route ? route.onMessage(message) : console.error(`Received MQTT message but could no find message route for topic ${topic}`)
  })
}

module.exports = subscribe