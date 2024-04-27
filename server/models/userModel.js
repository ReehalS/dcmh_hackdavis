const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

// static signup method
userSchema.statics.signup = async function(email, password) {

    if (!email  || !password) {
        throw new Error('All fields must be filled out correctly.')
    }
    if(!validator.isEmail(email)){
        throw new Error('Invalid email address')
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
    }

    const exists = await this.findOne({email})
    if (exists) {
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hashedPassword})

    return user
}

userSchema.statics.login = async function(email, password) {
    if(!email || !password) {
        throw new Error('All fields must be filled out correctly.')
    }
    const user = await this.findOne({email})
    if (!user) {
        throw new Error('User does not exist')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw new Error('Incorrect Passwrord')
    }

    return user

}

module.exports = mongoose.model('User', userSchema)