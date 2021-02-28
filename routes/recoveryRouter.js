const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const recoveryRouter=express.Router();
const User=require('../models/userSchema');

//This route handles recovery

recoveryRouter.route('/')
.post((req,res,next)=>{
    if(req.body.reqType=="userPresenceCheck"){
        User.findOne({clgID:req.body.clgID})
        .then((user)=>{
            if(!user){
                res.statusCode=404;
                res.json({
                    userPresent:false
                });
                return;
            }
            res.statusCode=200;
            res.json({
                userPresent:true,
                dbID:user.dbID,
                secQuestion:user.secQuestion
            });
        })
    }else if(req.body.reqType=="secAnswerChangePassword"){
        User.findById(req.body.dbID)
        .then((user)=>{
            if(user.secAnswer==req.body.secAnswer){
                User.findByIdAndUpdate(req.body.dbID,{
                    $set:{'authToken':req.body.authToken}
                }).then(()=>{
                    res.status=200;
                    res.json({
                        status:"passwordUpdated"
                    });
                });
            }else{
                res.statusCode=401;
                res.json({
                    status:"wrongAnswer"
                });
            }
        })
    }

})

module.exports=recoveryRouter;