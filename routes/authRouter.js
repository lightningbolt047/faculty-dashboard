const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const authRouter=express.Router();
const User=require('../models/userSchema');

//This route handles authentication

authRouter.route('/')
.post((req,res,next)=>{
    User.find({})
    .then((users)=>{
        var userPresent=false;
        for(var i=0;i<users.length;i++){
            if(users[i].clgID==req.body.clgID){
                userPresent=true;
                if(users[i].wrongAttempts>=10){
                    res.statusCode=403;
                    res.json({
                        "status":"Account locked",
                        "remainingAttempts":0
                    });
                    return;
                }
                if(users[i].authToken==req.body.token){
                    User.findByIdAndUpdate(users[i]._id,{
                        $set:{'wrongAttempts':0}
                    }).then((document)=>{
                        res.statusCode=200;
                        res.json({
                            "status": "Login Success",
                            "remainingAttempts": 10
                        });
                    });
                    break;
                }
                else{
                    User.findByIdAndUpdate(users[i]._id,{
                        $set:{'wrongAttempts':users[i].wrongAttempts+1}
                    }).then((document)=>{
                        res.statusCode=403;
                        res.json({
                            "status": "Wrong Password",
                            "remainingAttempts": 10-users[i].wrongAttempts-1
                        });
                    });
                    break;
                }
            }
        }
        if(userPresent==false){
            res.statusCode=404;
            res.json({
                "status": "No such clgID"
            });
        }
    })
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