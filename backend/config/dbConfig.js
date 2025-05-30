const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://aryan:Aarjearth777@cluster0.yfrdu.mongodb.net/tradeApp?retryWrites=true&w=majority&appName=Cluster0")

const connectionDb = mongoose.connection

connectionDb.on('error',(error)=>{
    console.log(error);
})

connectionDb.on('connected',()=>{
    console.log("Connected to Database successfully.")
})

module.exports = connectionDb