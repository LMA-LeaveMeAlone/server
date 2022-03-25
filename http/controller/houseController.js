const House = require('../model/House')
module.exports = {
  getHouseSensors: async (req, res) => {
    try {
      const house = await House.findOne({houseId: res.locals.houseId})
      if(!house) {res.status(404).send('The user does not have any house')}
      res.status(200).send(house.sensors)
    }catch(e) {
      res.status(500).send('Internal Error.')
      throw new Error(e)
    }

  }
}