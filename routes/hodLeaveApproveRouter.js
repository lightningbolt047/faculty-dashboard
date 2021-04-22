const express=require('express');

const hodLeaveApproveRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const User=require('../models/userSchema');

const checkCredentials=require('../services/checkCredentialsService');
const getFacultyAttendance=require('../services/getFacultyAttendance');

hodLeaveApproveRouter.route('/:reqType')
    .get(checkCredentials,(req,res,next)=>{
        User.findById(req.headers['dbid'])
            .then((user)=>{
                if(!user.hod){
                    res.statusCode=403;
                    res.json({
                        status:"Access Denied!"
                    });
                    return;
                }
                let hodDepartment=user.department;
                FacultyLeave.find({facultyDepartment:hodDepartment,leaveStatus: {$ne:'facultyCancelled'}})
                    .then(async (leaves)=>{
                        if(!leaves || leaves.length===0){
                            res.statusCode=404;
                            res.json({
                                status:"Resource Not found"
                            });
                            return;
                        }
                        let curDate=Date.now();
                        if(req.params.reqType==='getNumLeaves'){
                            let count=0;
                            for(const leave of leaves){
                                if(curDate > Date.parse(leave.arrivalTime) || leave.leaveStatus!=="pending"){
                                    continue;
                                }
                                count+=1;
                            }

                            res.statusCode=200;
                            res.json({
                                numLeaves:count
                            });
                            return;
                        }else if(req.params.reqType==='getAllLeaves'){
                            let sendDocument=[];
                            for(const leave of leaves){
                                if(curDate > Date.parse(leave.arrivalTime)){
                                    continue;
                                }
                                let facultyPersonalDetails=await User.findById(leave.facultyID);
                                facultyPersonalDetails.authToken=undefined;
                                facultyPersonalDetails.secQuestion=undefined;
                                facultyPersonalDetails.secAnswer=undefined;
                                facultyPersonalDetails.lastSuccessfulLogin=undefined;
                                facultyPersonalDetails.accountLockTime=undefined;
                                facultyPersonalDetails.wrongAttempts=undefined;
                                facultyPersonalDetails.imagePath=undefined;

                                try{
                                    sendDocument.push({
                                        personalDetails:facultyPersonalDetails,
                                        passDetails:{
                                            departureTime:leave.departureTime,
                                            arrivalTime:leave.arrivalTime,
                                            passStatus:leave.leaveStatus,
                                            reason:leave.reason,
                                            passID:leave._id
                                        },
                                        attendanceDetails:await getFacultyAttendance(leave.facultyID)
                                    });
                                }catch(e){
                                    res.statusCode=500;
                                    res.json({
                                        status:'Internal Server Error'
                                    });
                                }
                            }
                            res.statusCode=200;
                            res.json(sendDocument);
                        }else{
                            res.statusCode=400;
                            res.json({
                                status:"Bad Request"
                            });
                        }
                    },(err)=>{
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                    })
            },(err)=>{
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
            })
    });
hodLeaveApproveRouter.route('/')
    .post((req,res,next)=>{
       User.findById(req.headers['dbid'])
           .then((user)=>{
               if(!user.hod){
                   res.statusCode=403;
                   res.json({
                      status:"Access Denied!"
                   });
                   return;
               }
               FacultyLeave.findByIdAndUpdate(req.body.passID,{$set:{'leaveStatus':req.body.passStatus}},{runValidators:true})
                   .then((document)=>{
                       if(!document){
                           res.statusCode=404;
                           res.json({
                               status:'Invalid leave id'
                           });
                       }
                       res.statusCode=200;
                       res.json({
                           status:'Leave status updated successfully'
                       });
                   },(err)=>{
                       res.statusCode=400;
                       res.json({
                           status:'Bad request'
                       });
                   });
           })
    });

module.exports = hodLeaveApproveRouter;