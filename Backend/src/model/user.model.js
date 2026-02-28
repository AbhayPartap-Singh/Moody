const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"it al;ready exsits"],
        required:[true,"it is required"]
    },
    email:{
        type:String,
        unique:[true,"it al;ready exsits"],
        required:[true,"it is required"]
    },
    password:{
        type:String,
        required:[true,"it is required"]
    }
   
    
})

const userModel = mongoose.model('users',userSchema)

module.exports = userModel