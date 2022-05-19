const { exec } = require('child_process')
const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId
const Record = require('../../http/model/Record')
const extractFrames = require('ffmpeg-extract-frames')
const TMP_FILE_RECORDS = '/home/ubuntu/server/records/'

//AWS S3 CLOUD
const AWS = require('aws-sdk')
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME

//CLARIFAI RECOGNITION
const CLRF_USER_ID = process.env.CLRF_USER_ID
const CLRF_PAT = process.env.CLRF_PAT
const CLRF_APP_ID = process.env.CLRF_APP_ID
const CLRF_MODEL_ID = process.env.CLRF_MODEL_ID
const enumObjects = ['people', 'dog', 'cat', 'pet', 'animal']

module.exports = {
  recordCameraVideo: async () => {
    return new Promise((resolve) => {
      console.log('RECORDING VIDEO')
      //video name (timestamp)
      let video_name = getDate()
      //Exec camera recording
      exec(`raspivid -o ${TMP_FILE_RECORDS + video_name}.h264 -awb greyworld -t 5000`, (error, stdout, stderr) => {
        if (stderr || error) {
          resolve(stderr || error)
        }else{
          resolve(video_name)
        }
      })
    })
  },

  //params : video_name
  convertVideoToMp4: async (video_name) => {
    return new Promise((resolve) => {
      console.log('CONVERTING VIDEO')
      //Exec video convert to mp4
      exec(`MP4Box -add ${TMP_FILE_RECORDS + video_name}.h264 ${TMP_FILE_RECORDS + video_name}.mp4`, (error, stdout, stderr) => {
        if (stderr || error) {
          resolve(stderr || error)
        }else{
          resolve(true)
        }
      })
    })
  },

  analyseMovement: async (video_name) => {
    
    //extract image from video
    await extractFrames({
      input: TMP_FILE_RECORDS + video_name + '.mp4' ,
      output: TMP_FILE_RECORDS + 'predict.png',
      offsets: [
        1000
      ]
    })

    return new Promise((resolve) => {

      const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')

      const stub = ClarifaiStub.grpc()

      // This will be used by every Clarifai endpoint call
      const metadata = new grpc.Metadata()
      metadata.set('authorization', 'Key ' + PAT)

      const fs = require('fs')
      const imageBytes = fs.readFileSync(TMP_FILE_RECORDS + '/predict.png')
      console.log(imageBytes)

      stub.PostModelOutputs(
        {
          user_app_id: {
            'user_id': USER_ID,
            'app_id': APP_ID
          },
          model_id: MODEL_ID,
          //version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
          inputs: [
            { data: { image: { base64: imageBytes } } }
          ]
        },
        metadata,
        (err, response) => {
          if (err) {
            throw new Error(err)
          }

          if (response.status.code !== 10000) {
            throw new Error('Post model outputs failed, status: ' + response.status.description)
          }

          // Since we have one input, one output will exist here.
          const output = response.outputs[0]

          //console.log(output.data.concepts)

          for(let i = 0; i < output.data.concepts.length; i++){
            for(let j = 0; j < enumObjects.length; j++){
              //console.log(enumObjects[j] + ' ? ' + output.data.concepts[i].name)
              if(enumObjects[j] == output.data.concepts[i].name) return resolve(enumObjects[j])
            }
          }

          resolve('Alien')
        }
      )
    })
  }, 

  //params : video_name, house_id
  sendVideoToAWScloud: async (video_name, house_id) => {
    return new Promise((resolve) => {
      console.log('SENDING VIDEO')
      //Constante qui contient les info de connexion au bucket
      const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      })

      //Lecture du fichier vidéo que l'ont veut envoyer
      fs.readFile(TMP_FILE_RECORDS + video_name + '.mp4', (err, data) => {
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
          if(err) resolve(err)
          console.log('FILE UPLOADED')
          resolve(data.Location)
        })
      })
    })
  },

  addVideoToMongo: async(houseId, url, message) => {
    return new Promise((resolve) => {
      try{
        const record = new Record({
          _id: ObjectId(),
          datetime: new Date(),
          houseId: houseId,
          url: url,
          message: message
        })
        record.save().then(() => {
          resolve(true)
        })
      }catch(err){
        resolve(err)
      }
    })
  },

  deleteLocalData: async (video_name) => {
    return new Promise((resolve) => {
      console.log('DELETING IMAGE PREDICT')
      fs.unlink(TMP_FILE_RECORDS + 'predict.png', (err) => {
        if(err) resolve(err)
      })
      console.log('DELETING VIDEO')
      fs.unlink(TMP_FILE_RECORDS + video_name + '.h264', (err) => {
        if(err) resolve(err)
        fs.unlink(TMP_FILE_RECORDS + video_name + '.mp4', (err) => {
          if(err) resolve(err)
          resolve(true)
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
