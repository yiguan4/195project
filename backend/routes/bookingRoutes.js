const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/CarModel");

const stripe = require("stripe")(
  "sk_test_51KrzBBGpc1kpCMR6ZbdZswBssBPVLkonKisZXobdhjY5tI7k2MQ0mgXMO6Eb1qdyICBvXWxXNmmxdpfA0LDDZaAZ00yKJcznap"
);
const { v4: uuidv4 } = require("uuid");

router.post("/bookingcar", async (req, res) => {
    const { token } = req.body;
    try{
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const payment = await stripe.charges.create(
        {
          amount: req.body.money * 100,
          currency: "USD",
          customer: customer.id,
          receipt_email: token.email
        },
        {
          idempotencyKey: uuidv4(),
          
        }
      );

      if (payment) { 
        req.body.transactionId = payment.source.id;
        const newbooking = new Booking(req.body);
        await newbooking.save();

        const car = await Car.findOne({_id : req.body.car})
        car.bookedTime.push(req.body.bookedTime)
        await car.save();
        
        res.send("Your booking is successfull");
      }else{
        return res.status(400).json(error);
      }
      
    
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/allbookings", async(req, res) => {

  try {
      const query = {}
      if(req.query.userId){
        query.user = req.query.userId
      }
      const bookings = await Booking.find(query)
      res.send(bookings)
      
  } catch (error) {
      return res.status(400).json(error);
  }

});


module.exports = router;
