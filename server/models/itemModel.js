const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    name:{
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