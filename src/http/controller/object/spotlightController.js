const { getMQTTClient } = require('../../../mqtt/model/MqttConnector')
const { topics } = require('../../../mqtt/enums')
const House = require('../../model/House')
module.exports = {
  toggleLight: async (_req, res) => {
    try{
      console.log('bonsoir')
      const client = getMQTTClient()
      const house = await House.findOne({})
      house.objects.spotlight = !house.objects.spotlight
      process.env.ALLOW_MQTT && await client.publish(topics.spotlight, house.objects.spotlight ? '1' : '0')
      await House.findOneAndUpdate({_id: res.locals.user.houseId}, {objects: house.objects})
      res.status(200).send({spotlight: house.objects.spotlight})
    }catch(e){
      res.status(500).send('Internal error.')
      throw new Error(e)
    }
  }
}