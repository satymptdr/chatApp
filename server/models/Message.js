const mongoose = require('mongoose')

//creating msg schema
const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    room_id:{
        type:String,
        required:true
    },
},{timestamps:true}) //adding timestamp for msg

const Message = mongoose.model('message',messageSchema)
module.exports = Message;