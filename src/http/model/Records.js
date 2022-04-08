const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const RecordSchema = new mongoose.Schema({
  _id: ObjectId,
  datetime: Date,
  houseId: ObjectId,
  url: String,
  message: String
})
const Record = mongoose.model('record', RecordSchema)
 
module.exports = Record