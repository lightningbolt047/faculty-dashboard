const express=require('express');

const facultyLeaveApplyRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const FacultyAttendance=require('../models/facultyAttendanceSchema');
const User=require('../models/userSchema');

const checkCredentials=require('../services/checkCredentialsService');
const getLeaveDifferenceAsNumDays=require('../services/getDateDifferenceAsNumDays');
const getFacultyAttendance=require('../services/getFacultyAttendance');
const getMaxYearDocument=require('../services/getMaxYearDocument');
const TotalLeaveDays = require("../models/totalLeaveDaysSchema");

const giveLeaveNotAllowedResponse=(res)=>{
    res.statusCode=403;
    res.json({
       status:"You are not allowed to apply for more leaves than what is allocated to you"
    });
}

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
        FacultyLeave.findById(req.body.leaveID)
            .then(async (leave)=>{
                try{
                    let facultyAttendanceOverYears=await FacultyAttendance.find({facultyID: leave.facultyID});
                    try{
                        let latestFacultyAttendance=getMaxYearDocument(facultyAttendanceOverYears);
                        let numCasualLeaves=latestFacultyAttendance.casualLeaves;
                        let numEarnedLeaves=latestFacultyAttendance.earnedLeaves;
                        let numMedicalLeaves=latestFacultyAttendance.medicalLeaves;
                        let reduction=getLeaveDifferenceAsNumDays(new Date(leave.arrivalTime),new Date(leave.departureTime));
                        if(req.body.leaveStatus==='facultyCancelled' && leave.leaveStatus!=='facultyCancelled'){
                            if(leave.leaveTiming!=='full' && reduction===1){
                                reduction=0.5;
                            }
                            if(leave.leaveType==='cl'){
                                numCasualLeaves-=reduction;
                            }
                            else if(leave.leaveType==='el'){
                                numEarnedLeaves-=reduction;
                            }
                            else if(leave.leaveType==='ml'){
                                numMedicalLeaves-=reduction;
                            }
                        }
                        if(req.body.leaveStatus==='pending' && leave.leaveStatus!=='pending'){
                            if(leave.leaveTiming!=='full' && reduction===1){
                                reduction=0.5;
                            }
                            if(leave.leaveType==='cl'){
                                numCasualLeaves+=reduction;
                            }
                            else if(leave.leaveType==='el'){
                                numEarnedLeaves+=reduction;
                            }
                            else if(leave.leaveType==='ml'){
                                numMedicalLeaves+=reduction;
                            }
                        }
                        await FacultyAttendance.findByIdAndUpdate(latestFacultyAttendance._id,{$set:{
                                'casualLeaves':numCasualLeaves,
                                'numEarnedLeaves':numEarnedLeaves,
                                'numMedicalLeaves':numMedicalLeaves
                            }});
                        await FacultyLeave.findByIdAndUpdate(req.body.leaveID,{$set:{
                                'leaveStatus':req.body.leaveStatus,
                            }});
                        res.statusCode=200;
                        res.json({
                            status:"Leave status update successful"
                        });
                    }catch(e){
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                        return;
                    }
                }catch(e){
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                }
            });

        // FacultyLeave.findByIdAndUpdate(req.body.leaveID,{$set:{'leaveStatus':req.body.leaveStatus}},{runValidators:true})
        //     .then(()=>{
        //         res.statusCode=200;
        //         res.json({
        //             status:"Leave updated successfully"
        //         });
        //     },(err)=>{
        //         res.statusCode=400;
        //         res.json({
        //             status:'Bad request!'
        //         });
        //     })
    })
    .put(async (req,res,next)=>{
        try{
            if(typeof req.body.reason==='undefined' || typeof req.body.departureTime==='undefined' || typeof req.body.arrivalTime==='undefined' || typeof req.body.leaveTiming==='undefined' || req.body.leaveTiming==="" || typeof req.body.leaveType==='undefined' || req.body.leaveType===""){
                res.statusCode=400;
                res.json({
                    status:"Bad Request!"
                });
                return;
            }
            let departureTime=new Date(req.body.departureTime);
            let arrivalTime=new Date(req.body.arrivalTime);
            let curDate=new Date();
            let curDateString=curDate.getFullYear()+'-'+(curDate.getMonth()+1)+"-"+curDate.getDate()+"T"+"00:00:00.000Z";
            let curTime=Date.parse(curDateString);
            if(departureTime>arrivalTime || departureTime<curTime){
                res.statusCode=400;
                res.json({
                    status:"Bad Request!"
                });
                return;
            }
            let dateDifference=getLeaveDifferenceAsNumDays(new Date(arrivalTime),new Date(departureTime));
            if(dateDifference>1 && req.body.leaveTiming!=='full'){
                res.statusCode=400;
                res.json({
                    status:"Bad request"
                });
                return;
            }

            if(req.body.leaveTiming!=='full' && dateDifference===1){
                dateDifference=0.5;
            }

            let facultyAttendanceOverYears=await FacultyAttendance.find({facultyID:req.headers['dbid']});
            try{
                let latestFacultyAttendance;
                try{
                    latestFacultyAttendance=getMaxYearDocument(facultyAttendanceOverYears);
                    let totalLeaveDaysDocument=await TotalLeaveDays.findById(latestFacultyAttendance.totalLeaveDaysID);
                    if(totalLeaveDaysDocument.totalCasualLeaves<(latestFacultyAttendance.casualLeaves+dateDifference) && req.body.leaveType==='cl'){
                        giveLeaveNotAllowedResponse(res);
                        return;
                    }
                    if(totalLeaveDaysDocument.totalEarnedLeaves<(latestFacultyAttendance.earnedLeaves+dateDifference) && req.body.leaveType==='el'){
                        giveLeaveNotAllowedResponse(res);
                        return;
                    }
                    if(totalLeaveDaysDocument.totalMedicalLeaves<(latestFacultyAttendance.medicalLeaves+dateDifference) && req.body.leaveType==='ml'){
                        giveLeaveNotAllowedResponse(res);
                        return;
                    }
                }catch (e){
                    res.statusCode=404;
                    res.json({
                        status:"Resource Not Found!"
                    });
                    return;
                }
                if(latestFacultyAttendance.casualLeaves!==0 && dateDifference%3!==0 && req.body.leaveType==='el'){
                    res.statusCode=403;
                    res.json({
                        status:"You are allowed to apply for individual earned leaves only if you have exhausted your casual leaves"
                    });
                    return;
                }

                let numCasualLeaves=latestFacultyAttendance.casualLeaves;
                let numMedicalLeaves=latestFacultyAttendance.medicalLeaves;
                let numEarnedLeaves=latestFacultyAttendance.earnedLeaves;
                if(req.body.leaveType==='cl'){
                    numCasualLeaves+=dateDifference;
                }
                else if(req.body.leaveType==='ml'){
                    numMedicalLeaves+=dateDifference;
                }
                else if(req.body.leaveType==='el'){
                    console.log("Okay "+numEarnedLeaves+" "+dateDifference);
                    numEarnedLeaves+=dateDifference;
                }
                console.log("New nel: "+numEarnedLeaves);
                await FacultyAttendance.findByIdAndUpdate(latestFacultyAttendance._id,{$set:{
                    'casualLeaves':numCasualLeaves,
                    'earnedLeaves':numEarnedLeaves,
                    'medicalLeaves':numMedicalLeaves
                }});

                let user=await User.findById(req.headers['dbid']);
                let allFacultyAttendances=await FacultyAttendance.find({facultyID:req.headers['dbid']});
                if(allFacultyAttendances.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"Resource not found"
                    });
                    return;
                }
                try{
                    let latestDocument=getMaxYearDocument(allFacultyAttendances);
                    await FacultyLeave.create({
                        facultyID:req.headers['dbid'],
                        facultyDepartment:user.department,
                        reason:req.body.reason,
                        facultyAttendanceID:latestDocument._id,
                        leaveType:req.body.leaveType,
                        leaveTiming:req.body.leaveTiming,
                        departureTime:departureTime,
                        arrivalTime:arrivalTime
                    });
                    res.statusCode=200;
                    res.json({
                        status:"Leave Request successfully applied"
                    });
                }catch (e){
                    res.statusCode=404;
                    res.json({
                        status:"Resource not found"
                    });
                }
            }catch(e){
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
                return;
            }
        }catch(e){
            res.statusCode=400;
            res.json({
                status:"Bad Request"
            });
        }
    })









module.exports=facultyLeaveApplyRouter;