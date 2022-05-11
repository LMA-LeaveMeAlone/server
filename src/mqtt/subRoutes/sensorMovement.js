const cameraManager = require ('../model/CameraManager')
const admin = require('../../firebase')

module.exports = {
  onSensorMovement: async message => {
    console.log('Movement received :', message.toString())

    //RECORDING AND CONVERTING VIDEO
    let video_name = await cameraManager.recordCameraVideo()
    await cameraManager.convertVideoToMp4(video_name)

    //SENDING VIDEO TO CLOUD AND ANALYSE VIDEO
    let result = await Promise.all(
      [
        cameraManager.sendVideoToAWScloud(video_name, process.env.HOUSE_ID),
        cameraManager.analyseMovement(video_name)
      ].map(p => p.catch(e => e))
    )
    
    //ADD VIDEO URL TO MONGODB
    await cameraManager.addVideoToMongo(process.env.HOUSE_ID, result[0], result[1])

    //DELETE ALL FILES FROM RECORDING
    await cameraManager.deleteLocalData(video_name)

    const registrationToken = 'c6d4i3oTSnWqS8pUNxOXPR:APA91bFtWkNF-IX5Z4PZTWoePk3QPh-VLDcHCodc5eodOiijTzEelNdnlz0SO0YQVEsjlsW2fHFKAfFjlYpa35aAZ-2R062qwD3tObp-vBR8jHgJ32dlsKHYAuOwIx7nhLUqWkiPc3dE'

    const payload = {
      notification: {
        title: 'Nouvelle vidéo',
        body: 'Vous avez eu une nouvelle visite devant votre porte (' + result[1] + '), regardez la vidéo !',
      }
    }

    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
    }
    
    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        console.log('Error sending message:', error)
      })
  }
}