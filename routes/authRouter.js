const express=require('express');

const authRouter=express.Router();
const User=require('../models/userSchema');

const resetLockTime=require('../services/resetLockTime');
const wrongAuthRoutine=require('../services/wrongAuthRoutine');

//This route handles authentication

authRouter.route('/')
.post((req,res)=>{
    if(req.body.loginType==="cookie"){
        User.findById(req.body.dbID)
        .then(async (user)=>{
            if(!user){
                res.statusCode=404;
                res.json({
                    "status": "No such clgID"
                });
                return;
            }

            try{
                if(await resetLockTime(user,res)){
                    return;
                }
            }catch(e){
                res.statusCode=500;
                res.json({
                   'status':"Internal Server Error"
                });
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
                        "name":user.name,
                        "hod":user.hod,
                        "facultyType":user.facultyType,
                        "remainingAttempts": 10
                    });
                });
            }else{
                wrongAuthRoutine(user,res);
            }
        },()=>{
            res.statusCode=500;
            res.json({
                status:"Something went wrong"
            });
        });
    }
    if(req.body.loginType==="user"){
        User.findOne({clgID:req.body.clgID})
        .then(async (user)=>{
            if(!user){
                res.statusCode=404;
                res.json({
                    "status": "No such clgID"
                });
                return;
            }
            try{
                if(await resetLockTime(user,res)){
                    return;
                }
            }catch(e){
                res.statusCode=500;
                res.json({
                    'status':"Internal Server Error"
                });
            }
            if(user.authToken===req.body.authToken){
                User.findByIdAndUpdate(user._id,{
                    $set:{'wrongAttempts':0,'lastSuccessfulLogin': new Date(Date.now())}
                }).then(()=>{
                    res.statusCode=200;
                    res.json({
                        "status": "Login Success",
                        "dbID": user._id,
                        "name":user.name,
                        "facultyType":user.facultyType,
                        "hod":user.hod,
                        "remainingAttempts": 10
                    });
                });
            }
            else{
                wrongAuthRoutine(user,res);
            }
        })
    }
    
})

module.exports=authRouter;