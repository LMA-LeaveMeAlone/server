module.exports = {
  onSensorMovement: message => {
    console.log('Movement received : ', message.toString())
    console.log('Should start camera')
  }
}