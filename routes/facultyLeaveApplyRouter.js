const express=require('express');

const facultyLeaveApplyRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const User=require('../models/userSchema');

const checkCredentials=require('../services/checkCredentialsService');

facultyLeaveApplyRouter.route('/')
    .get(checkCredentials,(req,res)=>{
        FacultyLeave.find({facultyID:req.headers['dbid']})
            .then((leaves)=>{
                let curDate=Date.now();
                let sendDocument=[];
                for(const leave of leaves){
                    if(curDate > Date.parse(leave.arrivalTime)){
                        continue;
                    }
                    sendDocument.push(leave);
                }
                res.statusCode=200;
                res.json(sendDocument);
            },(err)=>{
                res.statusCode=500;
                res.json({
                    status:'Internal Server Error'
                });
            });
    })
    .post(checkCredentials,(req,res,next)=>{
        if(req.body.leaveStatus!=='facultyCancelled' && req.body.leaveStatus!=='pending'){
            res.statusCode=400;
            res.json({
                status:"Bad Request!"
            });
            return;
        }
        FacultyLeave.findByIdAndUpdate(req.body.leaveID,{$set:{'leaveStatus':req.body.leaveStatus}},{runValidators:true})
            .then(()=>{
                res.statusCode=200;
                res.json({
                    status:"Leave updated successfully"
                });
            },(err)=>{
                res.statusCode=400;
                res.json({
                    status:'Bad request!'
                });
            })
    })
    .put(async (req,res,next)=>{
        try{
            if(typeof req.body.reason==='undefined' || typeof req.body.departureTime==='undefined' || typeof req.body.arrivalTime==='undefined'){
                res.statusCode=400;
                res.json({
                    status:"Bad Request!"
                });
            }
            let departureTime=new Date(req.body.departureTime);
            let arrivalTime=new Date(req.body.arrivalTime);
            if(departureTime<=arrivalTime){
                res.statusCode=400;
                res.json({
                    status:"Bad Request!"
                });
            }
            let user=await User.findById(req.headers['dbid']);
            await FacultyLeave.insertOne({
               facultyID:req.headers['dbid'],
               facultyDepartment:user.department,
               reason:req.body.reason,
               departureTime:req.body.departureTime,
               arrivalTime:req.body.arrivalTime
            });
            res.statusCode=200;
            res.json({
                status:"Leave Request successfully applied"
            });
        }catch(e){
            res.statusCode=400;
            res.json({
                status:"Bad Request"
            });
        }
    })









module.exports=facultyLeaveApplyRouter;