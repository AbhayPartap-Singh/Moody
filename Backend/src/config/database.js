const mongoose = require("mongoose")

function ConnectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
     console.log("connected to Db")
    })
}

module.exports = ConnectToDb