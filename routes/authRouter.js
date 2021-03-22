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
            
            if(!user){
                res.statusCode=404;
                res.json({
                    "status": "No such clgID"
                });
                return;
            }

            if(user.wrongAttempts>=10){
                var timeDiff=Date.now()-user.accountLockTime;
                console.log(((timeDiff)/(1000*60*60)).toFixed(2));
                if(((timeDiff/(1000*60*60))).toFixed(2)<12){
                    res.statusCode=401;
                    res.json({
                        "status":"Account locked",
                        "remainingAttempts":0
                    });
                    console.log("Time remaining: "+(12-(timeDiff/(1000*60*60))).toFixed(2));
                    return;
                }
                user.wrongAttempts=0;
                user.save();
            }
            if(user.authToken===req.body.authToken){
                User.findByIdAndUpdate(req.body.dbID,{
                    $set:{'lastSuccessfulLogin': new Date(Date.now())}
                })
                .then(()=>{
                    res.statusCode=200;
                    res.json({
                        "status": "Login Success",
                        "dbID": user._id,
                        "remainingAttempts": 10
                    });
                });
            }else{
                user.wrongAttempts++;
                if(user.wrongAttempts>=10){
                    user.accountLockTime=new Date(Date.now());
                }
                user.save()
                .then(()=>{
                    res.statusCode=401;
                    res.json({
                        "status": "Wrong Password",
                        "remainingAttempts": 10-user.wrongAttempts
                    });
                    return;
                });
                return;
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
                var timeDiff=Date.now()-user.accountLockTime;
                console.log(((timeDiff)/(1000*60*60)).toFixed(2));
                if(((timeDiff/(1000*60*60))).toFixed(2)<12){
                    res.statusCode=401;
                    res.json({
                        "status":"Account locked",
                        "remainingAttempts":0
                    });
                    console.log("Time remaining: "+(12-(timeDiff/(1000*60*60))).toFixed(2));
                    return;
                }
                user.wrongAttempts=0;
                user.save();
            }
            if(user.authToken===req.body.authToken){
                User.findByIdAndUpdate(user._id,{
                    $set:{'wrongAttempts':0,'lastSuccessfulLogin': new Date(Date.now())}
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
                user.wrongAttempts++;
                if(user.wrongAttempts>=10){
                    user.accountLockTime=new Date(Date.now());
                }
                user.save()
                .then(()=>{
                    res.statusCode=401;
                    res.json({
                        "status": "Wrong Password",
                        "remainingAttempts": 10-user.wrongAttempts
                    });
                    return;
                });
                return;
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