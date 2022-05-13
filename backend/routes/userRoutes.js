const express = require("express");
const router = express.Router();
const User = require("../models/userModel")

router.post("/login", async(req, res) => {

    const {username , password} = req.body

    try {
        const user = await User.findOne({username , password})
        if(user) {
            res.send(user)
        }
        else{
            return res.status(400).json(error);
        }
    } catch (error) {
      return res.status(400).json(error);
    }

});

router.post("/register", async(req, res) => {

    try {
        const newuser = new User(req.body)
        await newuser.save()
        res.send('User registered successfully')
    } catch (error) {
      return res.status(400).json(error);
    }

});

router.get("/profile", async(req, res) => {
    try {
        const profile = await User.findOne({ _id: req.query._id });
        if(profile) {
            res.send(profile)
        }
        else{
            return res.status(400).json(error);
        }
    } catch (error) {
      return res.status(400).json(error);
    }

});

router.put("/profile", async (req, res) => {
    try {
        const profile = await User.findOne({ _id: req.body._id });
        profile.username = req.body.username;
        profile.password = req.body.password;
        profile.fullname = req.body.fullname;
        profile.email = req.body.email;
        profile.phone = req.body.phone;
        profile.age = req.body.age;
        // profile.driverLicense = req.body.driverLicense;
        profile.expDate = req.body.expDate;
        //profile.isCarOwner = req.body.isCarOwner;

        await profile.save();

        res.send("profile updated successfully");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});

module.exports = router