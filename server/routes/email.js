const express= require('express')

const { sendMail, sendLowNotif } = require('../controllers/emailController')

const router = express.Router()

router.post('/text-mail', sendMail); 
router.post('/send-notif', sendLowNotif);

module.exports = router;