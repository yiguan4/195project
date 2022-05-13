const express = require("express");
const router = express.Router();
const Car = require("../models/CarModel")


router.get("/Carlist", async(req, res) => {

    try {
        const car = await Car.find({})
        if(car) {
            res.send(car)
        }
        else{
            return res.status(400).json(error);
        }
    } catch (error) {
      return res.status(400).json(error);
    }

});



router.post("/addcar", async (req, res) => {
    try {
      const newcar = new Car(req.body);
      await newcar.save();
      res.send("Car added successfully");
    } catch (error) {
      return res.status(400).json(error);
    }
  });
  
  router.post("/editcar", async (req, res) => {
    try {
      const car = await Car.findOne({ _id: req.body._id });
      car.name = req.body.name;
      car.image = req.body.image;
      car.rentPerHour = req.body.rentPerHour;
     // car.carOwner = req.body.carOwner;
  
      await car.save();
  
      res.send("Car details updated successfully");
    } catch (error) {
      return res.status(400).json(error);
    }
  });
  
  router.post("/deletecar", async (req, res) => {
    try {
      await Car.findOneAndDelete({ _id: req.body.carid });
  
      res.send("Car deleted successfully");
    } catch (error) {
      return res.status(400).json(error);
    }
  });
  
module.exports = router