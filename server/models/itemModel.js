const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    title:{
        type: String,
        require:true,
        unique: true,
    }, 
    description:{
        type: String,
        require:true,
    },
    category:{
        type: String,
        enum: ['Food & Supplies', 'Cleaning and Sanitizing', 'Hygiene', 'Medicine'],
        require:true,
    },
    currentAmount:{
        type: Number,
        require:true,
    },
    maxAmount:{
        type: Number,
        require:true,
    },
    claimedAmount:{
        type: Number,
        require:false,
    }
})

module.exports = mongoose.model('Item', itemSchema)