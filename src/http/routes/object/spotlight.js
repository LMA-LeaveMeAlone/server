const express = require('express')
const router = new express.Router()
const { authenticateToken } = require('../../controller/auth')
const { toggleLight } = require('../../controller/object/spotlightController')

router.put('/toggle', authenticateToken, toggleLight)

module.exports = router