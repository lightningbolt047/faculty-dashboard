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
        User.find({clgID:req.body.clgID})
        .then((users)=>{ 
            if(users.length===0){
                res.statusCode=404;
                res.json({
                    "status": "No such clgID"
                });
                return;
            }
            if(users[0].wrongAttempts>=10){
                res.statusCode=401;
                res.json({
                    "status":"Account locked",
                    "remainingAttempts":0
                });
                return;
            }
            if(users[0].authToken===req.body.authToken){
                User.findByIdAndUpdate(users[0]._id,{
                    $set:{'wrongAttempts':0}
                }).then(()=>{
                    res.statusCode=200;
                    res.json({
                        "status": "Login Success",
                        "dbID": users[0]._id,
                        "remainingAttempts": 10
                    });
                });
            }
            else{
                User.findByIdAndUpdate(users[0]._id,{
                    $set:{'wrongAttempts':users[0].wrongAttempts+1}
                })
                .then((document)=>{
                    res.statusCode=401;
                    res.json({
                        "status": "Wrong Password",
                        "remainingAttempts": 10-users[0].wrongAttempts
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