const express=require('express');

const facultyLeaveApplyRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');

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
        FacultyLeave.findByIdAndUpdate(req.body.leaveID,{$set:{'leaveStatus':req.body.leaveStatus}},{runValidators:true})
            .then(()=>{
                res.statusCode=200;
                res.json({
                    status:"Leave updated successfully"
                });
            },(err)=>{
                res.statusCode=500;
                res.json({
                    status:'Internal Server Error'
                });
            })
    })









module.exports=facultyLeaveApplyRouter;