const { getMQTTClient } = require('../../../mqtt/model/MqttConnector')
const { topics } = require('../../../mqtt/enums')
const House = require('../../model/House')
module.exports = {
  toggleAlarm: async (_req, res) => {
    const client = getMQTTClient()
    client.publish(topics.alarm, 'toggle')
    const house = await House.findOne({})
    house.objects.alarm = !house.objects.alarm
    await House.findOneAndUpdate({_id: res.locals.user.houseId}, {objects: house.objects})
    res.status(200).send({alarm: house.objects.alarm})
  }
}