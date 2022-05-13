const mongoose = require("mongoose");

var DateOnly = require('mongoose-dateonly')(mongoose);

const userSchema = new mongoose.Schema({
     username : {type:String , required: true},
     password : {type:String , required: true},
     fullName : {type : String, required : true},
     email : {type : String, required : true},
     phone : {type : String, required : true},
     age : {type : Number , required : true},
     driverLicense: {type : String, required : true},
     expDate: {type : Date, required : true},
     isCarOwner:{type : Boolean}
})

const userModel = mongoose.model('users' , userSchema)

module.exports = userModel