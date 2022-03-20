const mqtt = require('mqtt')
const client = mqtt.connect(process.env.MQTT_BROKER_URL)

module.exports = client