const cameraManager = require ('../model/CameraManager')

module.exports = {
  onSensorMovement: async message => {
    console.log('Movement received :', message.toString())
    console.log('Recording video...')
    let video = await cameraManager.recordCameraVideo()
    console.log('video_name : ',video.video)
    await cameraManager.convertVideoToMp4(video.video)
    await cameraManager.sendVideoToAWScloud(video.video, 'house_id_1')
  }
}