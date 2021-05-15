const express=require('express');

const hodLeaveApproveRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const User=require('../models/userSchema');
const FacultyAttendance = require("../models/facultyAttendanceSchema");

const checkCredentials=require('../services/checkCredentialsService');
const getFacultyAttendance=require('../services/getFacultyAttendance');
const getLeaveDifferenceAsNumDays=require('../services/getDateDifferenceAsNumDays');
const getMaxYearDocument=require('../services/getMaxYearDocument');
const sendMail=require('../services/mailService');
const getDateStringFromDateObject=require('../services/getDateStringFromDateObject');
const getDayStringFromDateObject=require('../services/getDayStringFromDateObject');

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
                            res.statusCode=200;
                            if(req.params.reqType==='getNumLeaves'){
                                res.json({
                                    numLeaves:0
                                });
                            }else{
                                res.json(leaves);
                            }
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
                                            leaveType:leave.leaveType,
                                            leaveTiming:leave.leaveTiming,
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
                                    return;
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
           .then(async (user)=>{
               if(!user.hod){
                   res.statusCode=403;
                   res.json({
                      status:"Access Denied!"
                   });
                   return;
               }


               let leave=await FacultyLeave.findById(req.body.passID);
               if(leave.leaveType==='cancelled' && req.body.passStatus==='approved'){
                   res.statusCode=403;
                   res.json({
                       status:"Access Denied!"
                   });
                   return;
               }
               try{
                   let latestFacultyAttendance=getMaxYearDocument(await FacultyAttendance.find({facultyID: leave.facultyID}));
                   let numLeaveDays=getLeaveDifferenceAsNumDays(new Date(leave.arrivalTime),new Date(leave.departureTime));
                   let numCasualLeaves=latestFacultyAttendance.casualLeaves;
                   let numMedicalLeaves=latestFacultyAttendance.medicalLeaves;
                   let numEarnedLeaves=latestFacultyAttendance.earnedLeaves;
                   if(leave.leaveTiming!=='full' && numLeaveDays===1){
                       numLeaveDays=0.5;
                   }
                   if(leave.leaveType==='cl'){
                       if(req.body.passStatus==='cancelled') {
                           numCasualLeaves-=numLeaveDays;
                       }
                   }
                   else if(leave.leaveType==='ml'){
                       if(req.body.passStatus==='cancelled') {
                           numMedicalLeaves-=numLeaveDays;
                       }
                   }
                   else if(leave.leaveType==='el'){
                       if(req.body.passStatus==='cancelled') {
                           numEarnedLeaves-=numLeaveDays;
                       }
                   }
                   await FacultyAttendance.findByIdAndUpdate(latestFacultyAttendance._id,{$set:{
                       'casualLeaves':numCasualLeaves,
                       'earnedLeaves':numEarnedLeaves,
                       'medicalLeaves':numMedicalLeaves
                   }});
               }catch (e){
                   res.statusCode=500;
                   res.json({
                       status:"Internal Server Error"
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
                       User.findById(document.facultyID)
                           .then((user)=>{
                               let fromDate=new Date(document.departureTime);
                               let toDate=new Date(document.arrivalTime);
                               sendMail(user.email,`Your leave request was ${req.body.passStatus}`,"Leave Details:\n\nFrom: "+getDateStringFromDateObject(fromDate)+" "+getDayStringFromDateObject(fromDate)+"\n"+"Till: "+getDateStringFromDateObject(toDate)+" "+getDayStringFromDateObject(toDate)+"\n"+"Number of Days: "+getLeaveDifferenceAsNumDays(toDate,fromDate)+"\n"+"Leave Timing: "+document.leaveTiming.toUpperCase()+"\n"+"Leave Type: "+document.leaveType.toUpperCase()+"\n"+"Leave Reason: "+document.reason);
                           });
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