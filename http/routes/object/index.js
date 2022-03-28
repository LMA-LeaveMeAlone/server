const express = require('express')
const { authenticateToken } = require('../../controller/auth')
const { getSensorsStatus } = require('../../controller/object/objectController')
const router = new express.Router()

router.get('/', authenticateToken, getSensorsStatus)
router.use('/alarm', require('./alarm'))
router.use('/spotlight', require('./spotlight'))

module.exports = router