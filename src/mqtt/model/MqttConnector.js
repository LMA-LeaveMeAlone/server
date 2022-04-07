const mqtt = require('mqtt')
const subRoutes = require('../subRoutes')

let client = mqtt.MqttClient

module.exports = {
  connectAndSubscribe: () => {
    client = mqtt.connect(process.env.MQTT_BROKER_URL)
    client.on('connect', function () {
      console.log('OK -- Connected to MQTT client')
      subRoutes.forEach((route) => {
        client.subscribe(route.topic, err => {
          if (err) throw new Error(err.message)
          console.log(`OK -- Subscribed to ${route.topic}`)
        })
      })
    })
    client.on('message', (topic, message) => {
      const route = subRoutes.find(route => route.topic === topic)
      route ? route.onMessage(message) : console.error(`Received MQTT message but could no find message route for topic ${topic}`)
    })
  },
  getMQTTClient: () => {
    return client 
  }
}