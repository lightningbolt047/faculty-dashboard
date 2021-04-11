const express=require('express');

const hodLeaveApproveRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const User=require('../models/userSchema');

const checkCredentials=require('../services/checkCredentialsService');
const getFacultyAttendance=require('../services/getFacultyAttendance');

hodLeaveApproveRouter.route('/')
    .get(checkCredentials,(req,res,next)=>{
        User.findById(req.headers['dbid'])
            .then((user)=>{
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
                        let sendDocument=[];
                        for(const leave of leaves){
                            if(curDate > Date.parse(leave.arrivalTime)){
                                continue;
                            }
                            try{
                                sendDocument.push({
                                    personalDetails:await User.findById(leave.facultyID),
                                    passDetails:{
                                        departureTime:leave.departureTime,
                                        arrivalTime:leave.arrivalTime,
                                        passStatus:leave.leaveStatus,
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
                    })
            })
    })
    .post((req,res,next)=>{
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
               res.statusCode=500;
               res.json({
                   status:'Internal Server Error'
               });
           });
    });