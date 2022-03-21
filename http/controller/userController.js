const { generateAccessToken } = require('./auth')
const utils = require('./utils')

module.exports = {
  login: async (req, res) => {
    if (!req.body.emailOrUsername) {
      res.status(400).send('Please provide emailOrUserName attribute.'); return
    }
    if (!req.body.password) {
      res.status(400).send('Please provide password attribute.'); return
    }
    const user = {} // TODO find user with mongoose here
    if (utils.hashPassword(req.body.password) === user.password) {
      user.password = undefined
      res.status(200).send({
        user,
        accessToken: generateAccessToken(user),
      })
    } else {
      res.status(403).send('Incorrect password.')
    }
  },
}

