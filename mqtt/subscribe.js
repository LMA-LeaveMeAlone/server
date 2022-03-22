const { getMQTTClient } = require('./model/MQTTClient')
const messageRoutes = require('./messageRoutes')

function subscribe() {
  const client = getMQTTClient()
  client.on('connect', function () {
    console.log('OK -- Connected to MQTT client')
    messageRoutes.forEach((route) => {
      client.subscribe(route.topic, err => {
        if (err) throw new Error(err.message)
        console.log(`OK -- Subscribed to ${route.topic}`)
      })
    })
  })
  client.on('message', (topic, message) => {
    const route = messageRoutes.find(route => route.topic === topic)
    route ? route.onMessage(message) : console.error(`Received MQTT message but could no find message route for topic ${topic}`)
  })
}
module.exports = subscribe