const express = require('express')
const router = new express.Router()
const { login , createUser } = require('../controller/userController')

router.post('/login', login)
router.post('/register', createUser)

module.exports = router
