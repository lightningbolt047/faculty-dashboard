const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const profileRouter=express.Router();
const User=require('../models/userSchema');


router.get("/profile", function(req, res, next) {
  User.findOne({ clgID:req.body.clgID}), (err, user) => {
    if (!user) return res.status(404).send("No user found");
    res.json("user/profile", {
      user: user,
      clgID : clgID,
      imagepath:imagepath,
      email : email,
      phonenumber : phonenumber,
      address : address
    });
  });
  

  module.exports=profileRouter;