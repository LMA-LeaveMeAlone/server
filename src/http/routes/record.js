const express = require('express')
const { authenticateToken } = require('../controller/auth')
const router = new express.Router()
const { getRecords } = require('../controller/recordController')

router.get('/', authenticateToken, getRecords)

module.exports = router
