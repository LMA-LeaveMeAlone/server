const { generateAccessToken } = require('./auth')
const utils = require('./utils')
const User = require('../model/User')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  login: async (req, res) => {
    if (!req.body.emailOrUsername) {
      res.status(400).send('Please provide emailOrUsername attribute.'); return
    }
    if (!req.body.password) {
      res.status(400).send('Please provide password attribute.'); return
    }
    User.findOne(
      {
        '$or':
        [
          { userName :  req.body.emailOrUsername },
          { email  :  req.body.emailOrUsername }
        ]
      },
      (err, user) => {
        if(err){
          res.status(500).send('Internal error.')
          throw new Error(err)
        }
        if(!user){
          res.status(404).send('This email or username doesn\'t exists.')
          return
        }
        if(utils.hashPassword(req.body.password) === user.password){
          user.password = undefined
          res.status(200).send({user, accessToken: generateAccessToken(user)})
        }
        else{
          res.status(403).send('Incorrect password.')
        }
      }
    )
  },
  createUser: (req, res) => {
    res.status(400)
    if(!req.body.firstName){ res.send('Please provide firstName attribute.'); return }
    if(!req.body.lastName){ res.send('Please provide lastName attribute.'); return }
    if(!req.body.email){ res.send('Please provide email attribute.'); return }
    if(!req.body.password){ res.send('Please provide password attribute.'); return }
    if(!req.body.userName){ res.send('Please provide userName attribute.'); return }
    const user = new User(req.body)
  
    User.findOne(
      {
        '$or':
        [
          { userName :  user.userName },
          { email  :  user.email }
        ]
      },(err, foundUser) => {
        if(err)
          throw new Error(err)
        if(foundUser){
          if(user.userName === foundUser.userName){
            res.status(403).send('Username already exists.')
            return
          }
          else{
            res.status(403).send('Email already exists.')
            return
          }
        }
        user._id = ObjectId()
        user.password = utils.hashPassword(user.password)    
        user.save((err, user) => {
          if(err)
            throw new Error(err)
          user.password = undefined
          res.status(201).send({ user, accessToken: generateAccessToken(user) })  
        })
      })
  }
}



