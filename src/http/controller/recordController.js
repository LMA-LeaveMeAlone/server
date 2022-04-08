const Record = require('../model/Record')

module.exports = {
  getRecords: async (req, res) => {
    try{
      const records = await Record.find({houseId: res.locals.user.houseId})
      res.send(records)
    }catch(e){
      res.status(500).json({
        message: 'Error when getting records',
        error: e
      })
    }
  }
}