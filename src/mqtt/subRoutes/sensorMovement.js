const cameraManager = require ('../model/CameraManager')


module.exports = {
  onSensorMovement: async message => {
    console.log('Movement received :', message.toString())

    let video_name = await cameraManager.recordCameraVideo()
    await cameraManager.convertVideoToMp4(video_name)
    let video_location = await cameraManager.sendVideoToAWScloud(video_name, process.env.HOUSE_ID)
    await cameraManager.addVideoToMongo(process.env.HOUSE_ID, video_location, 'undefined')
    await cameraManager.deleteVideoLocally(video_name)
  }
}