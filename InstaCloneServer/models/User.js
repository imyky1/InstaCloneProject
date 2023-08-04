const mongoose = require('mongoose')

const Userschema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email : {
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    profilepic:{
        type:String,
        default:''
    },
    about:{
        type:String,
        default:''
    }
})

module.exports = new mongoose.model('User',Userschema)