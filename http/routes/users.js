const express = require('express')
const router = new express.Router()
const { login } = require('../controller/userController')

router.post('/login', login)

module.exports = router
