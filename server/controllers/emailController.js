const express = require('express')
var nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'kaitlynqvo@gmail.com',
            pass: 'vtmmcdmgtycllbxg',
         },
    secure: true,
  });

const sendMail = async (req, res) => {
    const {to, subject, text} = req.body;
    const mailData = {
        from: 'kaitlynqvo@gmail.com',
        to: to,
        subject: subject, 
        text: text
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({ message: "Mail sent", message_id: info.messageId});
    });
};

module.exports = { sendMail };