const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const HouseSchema = new mongoose.Schema({
  _id: ObjectId,
  activated: Boolean,
  digitalKey: String,
  objects: Object
})
const House = mongoose.model('house', HouseSchema)

module.exports = House
