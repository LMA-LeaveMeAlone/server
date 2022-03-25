const { getMQTTClient } = require('../../mqtt/model/MqttConnector')
const { topics } = require('../../mqtt/enums')
module.exports = {
  toggleLight: (_req, res) => {
    const client = getMQTTClient()
    client.publish(topics.spotlight, 'toggle')
    res.status(200).send('Light toggled')
  }
}