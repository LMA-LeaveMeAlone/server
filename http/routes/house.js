const express = require('express')
const { authenticateToken } = require('../controller/auth')
const { getHouseSensors } = require('../controller/houseController')
const router = new express.Router()

router.get('/sensors', authenticateToken, getHouseSensors)
router.use('/sensors/alarm', require('./alarm'))
router.use('/sensors/spotlight', require('./spotlight'))

module.exports = router