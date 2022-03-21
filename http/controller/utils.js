const sha = require('sha.js')

module.exports = {
  hashPassword: (pass) => {
    return sha('sha256').update(pass).digest('hex')
  },
}
