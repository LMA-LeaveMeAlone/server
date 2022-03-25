const express = require('express')
const router = new express.Router()
const { authenticateToken } = require('../controller/auth')
const { toggleAlarm } = require('../controller/alarmController')

router.put('/toggle', authenticateToken, toggleAlarm)

module.exports = router