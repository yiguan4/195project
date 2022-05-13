const mongoose = require("mongoose");

function connectDB(){

    mongoose.connect('mongodb+srv://carental:123abc@cluster0.xpzuz.mongodb.net/car_rental?retryWrites=true&w=majority',{useUnifiedTopology: true, useNewUrlParser:true})

    const connection = mongoose.connection

    connection.on('connected', ()=>{
        console.log('MongoDB Connected')
    })

    connection.on('error', ()=>{
        console.log('MongoDB Fail')
    })
}

connectDB()

module.exports = mongoose