const express= require('express')

const { sendMail } = require('../controllers/emailController')

const router = express.Router()

router.post('/text-mail', sendMail); 

module.exports = router;