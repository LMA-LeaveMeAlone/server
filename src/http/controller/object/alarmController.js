const { getMQTTClient } = require('../../../mqtt/model/MqttConnector')
const { topics } = require('../../../mqtt/enums')
const House = require('../../model/House')
module.exports = {
  toggleAlarm: async (_req, res) => {
    try{
      const client = getMQTTClient()
      const house = await House.findOne({})
      house.objects.alarm = !house.objects.alarm
      process.env.ALLOW_MQTT && client.publish(topics.alarm, house.objects.alarm ? '1' : '0')
      await House.findOneAndUpdate({_id: res.locals.user.houseId}, {objects: house.objects})
      res.status(200).send({alarm: house.objects.alarm})
    }catch(e){
      res.status(500).send('Internal error.')
      throw new Error(e)
    }
  }
}
