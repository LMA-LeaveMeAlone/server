const { getMQTTClient } = require('../../../mqtt/model/MqttConnector')
const { topics } = require('../../../mqtt/enums')
const House = require('../../model/House')
module.exports = {
  toggleLight: async (_req, res) => {
    try{
      const client = getMQTTClient()
      await client.publish(topics.spotlight, 'toggle')
      const house = await House.findOne({})
      house.objects.spotlight = !house.objects.spotlight
      await House.findOneAndUpdate({_id: res.locals.user.houseId}, {objects: house.objects})
      res.status(200).send({spotlight: house.objects.spotlight})
    }catch(e){
      res.status(500).send('Internal error.')
      throw new Error(e)
    }
  }
}