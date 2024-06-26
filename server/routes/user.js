const express= require('express')

const {loginUser, signupUser, signupAdmin} = require('../controllers/userController')

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.post('/signupAdmin', signupAdmin)


module.exports = router