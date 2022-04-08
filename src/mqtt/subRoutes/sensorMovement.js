const cameraManager = require ('../model/CameraManager')

module.exports = {
  onSensorMovement: async message => {
    console.log('Movement received :', message.toString())

    let video_name = await cameraManager.recordCameraVideo()
    await cameraManager.convertVideoToMp4(video_name)
    await cameraManager.sendVideoToAWScloud(video_name, 'house_id_1')
    await cameraManager.deleteVideoLocally(video_name)
  }
}