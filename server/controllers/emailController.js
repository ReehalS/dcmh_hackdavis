const express = require('express')
const nodemailer = require('nodemailer')
const User = require('../models/userModel');
const Item = require('../models/itemModel');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS,
         },
    secure: true,
  });

const sendMail = async (req, res) => {
    const {to, subject, text} = req.body;
    const mailData = {
        from: process.env.EMAIL,
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

const sendLowNotif = async (req, res) => {
    const {threshold} = req.body;

    User.find({}, {_id:0 ,email:1})
        .then((emails) => {
            var emailList = '';
            for (var e of emails) {
                emailList += e.email + ", "
            }
            Item.find().then((items) => {
                var lowItems = ""
                for (var item of items) {
                    if (item.currentAmount + item.claimedAmount < threshold) {
                        lowItems += "<li>" + item.title + "</li>"
                    }
                }

                const mailData = {
                    from: process.env.EMAIL,
                    to: emailList,
                    subject: "Davis Community Meals and Housing is in Urgent Need of Donations!", 
                    html: "<p>Hello Davis Community Member, </p> <p>Davis Community Meals and Housing is running low on donations, and we need your help!</p> <p>The current urgently needed items are: " + lowItems + "</p> <b>Please see our website {} to find how to sign up and donate!</b>"
                };

                transporter.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    res.status(200).send({ message: "Mail sent", message_id: info.messageId});
                });
            })
        });
};

module.exports = { sendMail, sendNotif };