const express=require('express');
const multer = require('multer');
const fs=require('fs');

const profileRouter=express.Router();
const User=require('../models/userSchema');
const checkCredentials=require('../services/checkCredentialsService');
const getFacultyAttendance=require('../services/getFacultyAttendance');

//This route handles authentication


const uploader=multer({
    storage: multer.diskStorage({
        destination: (req,res,cb)=>{
            cb(null, 'public/images');
        },
    
        filename: (req,file,cb)=>{
            cb(null,Date.now()+'_'+file.originalname);
        }
    }),
    fileFilter: (req,file,cb)=>{
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('You can upload only image files'),false);
        }
        cb(null,true);
    }
});



profileRouter.route('/:reqType')
.get(checkCredentials,async (req,res)=>{
    try {
        if(req.params.reqType==='getAttendance'){
            let attendanceDetails=await getFacultyAttendance(req.headers['dbid']);
            res.statusCode=200;
            res.json(attendanceDetails);
            return;
        }
    }catch(e){
        res.statusCode=400;
        res.json({
            status:"Bad Request"
        });
    }

    User.findById(req.headers['dbid'])
    .then((user)=>{
        if(req.params.reqType==='getFullProfile'){
            let userData=user;
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
        else if(req.params.reqType==='getFacultyNameOnly'){
            res.statusCode=200;
            res.json({
                name:user.name
            });
        }
    },()=>{
        res.statusCode=500;
        res.json({
            status:'Internal Server Error'
        });
    })
})

profileRouter.route('/')
.post(checkCredentials,(req,res)=>{
    if(typeof req.headers['dbid']==='undefined'){
        res.statusCode=404;
        res.json({
            status:'Invalid dbID'
        });
    }
    if(req.body.updateType==='personalInfoUpdate'){
        User.findByIdAndUpdate(req.headers['dbid'],{
            "$set":{
                "phoneNumber":req.body.phoneNumber,
                "address":req.body.address,
                "email":req.body.email,
                "secQuestion":req.body.secQuestion,
                "secAnswer":req.body.secAnswer,
                "imagePath":req.body.imagePath
            }
        }).then(()=>{
            res.statusCode=200;
            res.json({
                'status':'Successfully updated details'
            });
        },()=>{
            res.statusCode=500;
            res.json({
               status:'Internal server error' 
            });
        });
    }
    if(req.body.updateType==='authTokenChange'){
        User.findByIdAndUpdate(req.headers['dbid'],{
            "$set":{
                "authToken":req.body.authToken,
            }
        })
        .then(()=>{
            res.statusCode=200;
            res.json({
                'status':'Successfully updated password'
            });
        },()=>{
            res.statusCode=500;
            res.json({
               status:'Internal server error' 
            });
        })
    }
});

profileRouter.route('/uploadimg/')
.post(checkCredentials,uploader.single('imageFile'),(req,res)=>{
    User.findById(req.headers['dbid'])
    .then((user)=>{
        if(typeof (user.imagePath) !== 'undefined'){
            if(fs.existsSync(user.imagePath)){
                fs.unlinkSync(user.imagePath);
            }
        }
        User.findByIdAndUpdate(req.headers['dbid'],{
            $set:{'imagePath':req.file.path}
        }).then((document)=>{
            res.statusCode=200;
            res.json(document);
        },()=>{
            res.statusCode=500;
            res.end('An error occurred');
        })
    })
});



module.exports=profileRouter;