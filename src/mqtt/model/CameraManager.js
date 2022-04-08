const { exec } = require('child_process')
const fs = require('fs')

const AWS = require('aws-sdk')
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME

const tmp_file_records = '/home/ubuntu/server/records/'

module.exports = {
  recordCameraVideo: async () => {
    return new Promise((resolve) => {
      //video name (timestamp)
      let video_name = getDate()
      //Exec camera recording
      exec(`raspivid -o ${tmp_file_records + video_name}.h264 -awb greyworld -t 5000`, (error, stdout, stderr) => {
        if (stderr || error) {
          console.log(stderr || error)
          resolve({video: false})
        }else{
          console.log('test')
          resolve({video: video_name})
        }
      })
    })
  },

  //params : video_name
  convertVideoToMp4: async (video_name) => {
    return new Promise((resolve) => {
      //Exec video convert to mp4
      exec(`MP4Box -add ${tmp_file_records + video_name}.h264 ${tmp_file_records + video_name}.mp4`, (error, stdout, stderr) => {
        if (stderr || error) {
          resolve({video: false})
        }else{
          resolve({video: true})
        }
      })
    })
  },

  //params : video_name, house_id
  sendVideoToAWScloud: async (video_name, house_id) => {
    return new Promise((resolve) => {
      //Constante qui contient les info de connexion au bucket
      const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      })

      //Lecture du fichier vidéo que l'ont veut envoyer
      fs.readFile(tmp_file_records + video_name + '.mp4', (err, data) => {
        if(err) resolve({result: false})

        //Paramètres pour l'envoie de la vidéo
        const params = {
          Bucket: AWS_BUCKET_NAME, //Nom du bucket
          Key: house_id + '/' + video_name + '.mp4', //Répertoire ou l'ont veut upload la vidéo (houseId + nom de la vidéo)
          Body: data, //Le buffer de la video
          ContentType: 'video/mp4'  //Le type du fichier
        }

        //Utilisation de la fonction upload d'AWS-SDK
        s3.upload(params, (err, data) => {
          if(err) resolve({result: false})
          console.log(`File uploaded at ${data.Location}`)   
        })
      })
    })
  }
}

function getDate(){
  var today = new Date()
  var date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate()
  var time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds()
  return date+'_'+time
}