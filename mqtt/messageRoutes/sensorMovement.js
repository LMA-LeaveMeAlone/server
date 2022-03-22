module.exports = {
  onSensorMovement: message => {
    console.log('Movement received :', message.toString())
    console.log('Should start camera') //TODO Python script to start camera
  }
}