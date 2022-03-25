const sha = require('sha.js')

module.exports = {
  hash: (pass) => {
    return sha('sha256').update(pass).digest('hex')
  },
}
