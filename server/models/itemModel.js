const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    title:{
        type: String,
        require:true,
        unique:true,
    }, 
    description:{
        type: String,
        require:true,
        unique:false,
    },
    category:{
        type: String,
        enum: ['Food & Supplies', 'Cleaning and Sanitizing', 'Hygiene', 'Medicine'],
        require:true,
        unique:false,
    },
    currentAmount:{
        type: Number,
        require:true,
        unique:false,
    },
    maxAmount:{
        type: Number,
        require:true,
        unique:false,
    },
    claimedAmount:{
        type: Number,
        require:true,
        unique:false,
    },
},{
        timestamps: true // Add timestamps option
    })

module.exports = mongoose.model('Item', itemSchema)