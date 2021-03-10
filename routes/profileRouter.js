const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const profileRouter=express.Router();
const User=require('../models/userSchema');

//This route handles authentication

function checkCredentials(req,res,next){
    User.findById(req.params.dbID)
    .then((user)=>{
        if(!user){
            res.statusCode=404;
            res.json({
                status: "Invalid dbID"
            });
            return;
        }
        if(user.authToken===req.headers['authtoken']){
            next();
        }
        else{
            res.statusCode=401;
            res.json({
                status: "Invalid authToken"
            });
            return;
        }
    })
}

profileRouter.route('/:dbID/:reqType')
.get(checkCredentials,(req,res,next)=>{
    User.findById(req.params.dbID)
    .then((user)=>{
        if(req.params.reqType==='getFullProfile'){
            var userData=user;
            userData.__v=undefined;
            userData.authToken=undefined;
            res.statusCode=200;
            res.json(userData);
        }
        else if(req.params.reqType==='getClgIDOnly'){
            res.statusCode=200;
            res.json({
                clgID:user.clgID
            });
        }
    },(err)=>{
        res.statusCode=500;
        res.json({
            status:'Internal Server Error'
        });
    })
})

profileRouter.route('/:dbID')
.post(checkCredentials,(req,res,next)=>{
    if(typeof req.params.dbID==='undefined'){
        res.statusCode=404;
        res.json({
            status:'Invalid dbID'
        });
    }
    if(req.body.updateType==='personalInfoUpdate'){
        User.findByIdAndUpdate(req.params.dbID,{
            "$set":{
                "phoneNumber":req.body.phoneNumber,
                "address":req.body.address,
                "email":req.body.email,
                "secQuestion":req.body.secQuestion,
                "secAnswer":req.body.secAnswer,
                "imagePath":req.body.imagePath
            }
        }).then((user)=>{
            res.statusCode=200;
            res.json({
                'status':'Successfully updated details'
            });
        },(err)=>{
            res.statusCode=500;
            res.json({
               status:'Internal server error' 
            });
        });
    }
    if(req.body.updateType==='authTokenChange'){
        User.findByIdAndUpdate(req.params.dbID,{
            "$set":{
                "authToken":req.body.authToken,
            }
        })
        .then((user)=>{
            res.statusCode=200;
            res.json({
                'status':'Successfully updated password'
            });
        },(err)=>{
            res.statusCode=500;
            res.json({
               status:'Internal server error' 
            });
        })
    }
});



module.exports=profileRouter;