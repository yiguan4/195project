const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
      car : {type : mongoose.Schema.Types.ObjectID , ref:'cars'},
      user : {type : mongoose.Schema.Types.ObjectID , ref:'users'},
      bookedTime : {
        startTime : {type : String} ,
        endTime : {type : String}
      } ,
      days : {type : Number},
      money : {type : Number},
      transactionId : {type : String}

},
  {timestamps : true}
)

const bookingModel = mongoose.model('bookings' , bookingSchema)

module.exports = bookingModel