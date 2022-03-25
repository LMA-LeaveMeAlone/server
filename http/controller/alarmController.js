const { getMQTTClient } = require('../../mqtt/model/MqttConnector')
const { topics } = require('../../mqtt/enums')
module.exports = {
  toggleAlarm: (_req, res) => {
    const client = getMQTTClient()
    client.publish(topics.alarm, 'toggle')
    res.status(200).send('Alarm toggled')
  }
}