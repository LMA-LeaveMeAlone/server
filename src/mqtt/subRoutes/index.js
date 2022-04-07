const { onSensorMovement } = require('./sensorMovement')
const { topics } = require('../enums')
module.exports = [
  {
    topic: topics.sensorMovement,
    onMessage: onSensorMovement
  }
]