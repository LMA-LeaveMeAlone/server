const mqtt = require('mqtt')

module.exports = {
  getMQTTClient: () => {
    return mqtt.connect(process.env.MQTT_BROKER_URL)
  } 
}