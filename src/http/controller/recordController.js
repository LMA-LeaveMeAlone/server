const Record = require('../model/Record')

module.exports = {
  getRecords: async (req, res) => {
    try{
      const records = await Record.find({houseId: res.locals.user.houseId})
      if(records.length === 0){
        res.status(404).json({message: 'No records found for this house'})
      }
      res.send(records)
    }catch(e){
      res.status(500).json({
        message: 'Error when getting records',
        error: e
      })
    }
  }
}
