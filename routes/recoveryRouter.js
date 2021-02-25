const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const recoveryRouter=express.Router();
const User=require('../models/userSchema');

//This route handles authentication

recoveryRouter.route('/')
.post((req,res,next)=>{
    if(req.body.reqType=="userPresenceCheck"){
        var userPresent=false;
        var dbID;
        var secQuestion;
        User.find({}).then((users)=>{
            for(var i=0;i<users.length;i++){
                if(users[i].clgID==req.body.clgID){
                    userPresent=true;
                    dbID=users[i]._id;
                    secQuestion=users[i].secQuestion;
                    break;
                }
            }
            if(userPresent){
                res.statusCode=200;
                res.json({
                    userPresent:userPresent,
                    dbID:dbID,
                    secQuestion:secQuestion
                });
            }else{
                res.statusCode=404;
                res.json({
                    userPresent:userPresent
                });
            }
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
                res.statusCode=403;
                res.json({
                    status:"wrongAnswer"
                });
            }
        })
    }

})

module.exports=recoveryRouter;