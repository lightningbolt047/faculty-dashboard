const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const authRouter=express.Router();
const User=require('../models/userSchema');

//This route handles authentication

authRouter.route('/')
.post((req,res,next)=>{
    if(req.body.loginType==="cookie"){
        User.findById(req.body.dbID)
        .then((user)=>{
            if(user.authToken===req.body.authToken){
                res.statusCode=200;
                res.json({
                    "status": "Login Success",
                    "dbID": user._id,
                    "remainingAttempts": 10
                });
                return;
            }else{
                User.findByIdAndUpdate(req.body.dbID,{
                    $set:{'wrongAttempts':user.wrongAttempts+1}
                }).then(()=>{
                    res.statusCode=401;
                    res.json({
                        "status": "Wrong Password",
                        "remainingAttempts": 10-user.wrongAttempts
                    });
                });
            }
        },(err)=>{
            res.statusCode=500;
            res.json({
                status:"Something went wrong"
            });
        });
    }
    if(req.body.loginType==="user"){
        User.findOne({clgID:req.body.clgID})
        .then((user)=>{ 
            if(!user){
                res.statusCode=404;
                res.json({
                    "status": "No such clgID"
                });
                return;
            }
            if(user.wrongAttempts>=10){
                res.statusCode=401;
                res.json({
                    "status":"Account locked",
                    "remainingAttempts":0
                });
                return;
            }
            if(user.authToken===req.body.authToken){
                User.findByIdAndUpdate(user._id,{
                    $set:{'wrongAttempts':0}
                }).then(()=>{
                    res.statusCode=200;
                    res.json({
                        "status": "Login Success",
                        "dbID": user._id,
                        "remainingAttempts": 10
                    });
                });
            }
            else{
                User.findByIdAndUpdate(user._id,{
                    $set:{'wrongAttempts':user.wrongAttempts+1}
                })
                .then((document)=>{
                    res.statusCode=401;
                    res.json({
                        "status": "Wrong Password",
                        "remainingAttempts": 10-user.wrongAttempts
                    });
                });
            }
        })
    }
    
})

.put((req,res,next)=>{
    User.create(req.body)
    .then((doc)=>{
        res.statusCode=200;
        res.json(doc);
    })
})

.patch((req,res,next)=>{
    User.findByIdAndUpdate(req.body.id,{
        $set:{"wrongAttempts":0}
    }).then((doc)=>{
        res.end("Updated");
    })
})

module.exports=authRouter;