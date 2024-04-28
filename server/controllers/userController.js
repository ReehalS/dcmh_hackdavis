const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const express= require('express')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}


const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        const token = createToken(user._id)

        isAdmin = user.isAdmin

        res.status(200).json({email,token, isAdmin})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.signup(email, password)

        const token = createToken(user._id)

        isAdmin = user.isAdmin

        res.status(200).json({email,token, isAdmin})

        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupAdmin = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.signupAdmin(email, password)

        const token = createToken(user._id)

        res.status(200).json({email,token, isAdmin})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = { loginUser, signupUser, signupAdmin}