const { onSensorMovement } = require('./sensorMovement')

module.exports = [
  {
    topic: '/sensor/movement',
    onMessage: onSensorMovement
  }
]