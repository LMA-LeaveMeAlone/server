const { generateAccessToken } = require('./auth')
const { hash } = require('./utils')
const User = require('../model/User')
const House = require('../model/House')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  login: async (req, res) => {
    if (!req.body.emailOrUserName) {
      res.status(400).send('Please provide emailOrUserName attribute.'); return
    }
    if (!req.body.password) {
      res.status(400).send('Please provide password attribute.'); return
    }
    User.findOne(
      {
        '$or':
        [
          { userName :  req.body.emailOrUserName },
          { email  :  req.body.emailOrUserName }
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
        if(hash(req.body.password) === user.password){
          user.password = undefined
          res.status(200).send({user, accessToken: generateAccessToken(user)})
        }
        else{
          res.status(403).send('Incorrect password.')
        }
      }
    )
  },
  createUser: async (req, res) => {
    res.status(400)
    if(!req.body.firstName){ res.send('Please provide firstName attribute.'); return }
    if(!req.body.lastName){ res.send('Please provide lastName attribute.'); return }
    if(!req.body.email){ res.send('Please provide email attribute.'); return }
    if(!req.body.password){ res.send('Please provide password attribute.'); return }
    if(!req.body.userName){ res.send('Please provide userName attribute.'); return }
    if(!req.body.digitalKey){ res.send('Please provide digitalKey attribute.'); return }
    const body = req.body
    try{
      const foundUser = await User.findOne({'$or':[{ userName :  body.userName },{ email  :  body.email }]})
      if(foundUser){
        if(body.userName === foundUser.userName){res.status(403).send('Username already exists.'); return}
        else{res.status(403).send('Email already exists.');return}
      }

      const foundHouse = await House.findOne({digitalKey: hash(body.digitalKey)})
      if(!foundHouse) {res.status(403).send('Digital key doesn\'t exists.');return}
      if(foundHouse.activated === true) {res.status(403).send('This house has already been activated.');return}
      
      const user = new User(body)
      user._id = ObjectId()
      user.password = hash(body.password)
      user.houseId = foundHouse._id
      await user.save()
      await House.findOneAndUpdate({_id: foundHouse._id},{activated: true})
      user.houseId = user.password = user._id = undefined
      res.status(201).send({ user, accessToken: generateAccessToken(user) })  
    }catch(err){
      res.status(500).send('Internal error.')
      throw new Error(err)
    }
  }
}



