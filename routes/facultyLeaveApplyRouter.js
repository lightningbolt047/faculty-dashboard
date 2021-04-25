const express=require('express');

const facultyLeaveApplyRouter=express.Router();

const FacultyLeave=require('../models/facultyLeaveSchema');
const FacultyAttendance=require('../models/facultyAttendanceSchema');
const User=require('../models/userSchema');

const checkCredentials=require('../services/checkCredentialsService');
const getLeaveDifferenceAsNumDays=require('../services/getDateDifferenceAsNumDays');

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
                    if(facultyAttendanceOverYears.length===0){
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                        return;
                    }
                    let maxYear=facultyAttendanceOverYears[0].year;
                    let latestFacultyAttendance=facultyAttendanceOverYears[0];
                    for(const facultyAttendance of facultyAttendanceOverYears){
                        if(maxYear<facultyAttendance.year){
                            latestFacultyAttendance=facultyAttendance;
                            maxYear=facultyAttendance.year;
                        }
                    }
                    let numCasualLeaves=latestFacultyAttendance.casualLeaves;
                    let numEarnedLeaves=latestFacultyAttendance.earnedLeaves;
                    let numMedicalLeaves=latestFacultyAttendance.medicalLeaves;
                    let reduction=getLeaveDifferenceAsNumDays(new Date(leave.arrivalTime),new Date(leave.departureTime));
                    if(req.body.leaveStatus==='facultyCancelled' && leave.leaveStatus==='approved'){
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
            if(typeof req.body.reason==='undefined' || typeof req.body.departureTime==='undefined' || typeof req.body.arrivalTime==='undefined'){
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

            let facultyAttendanceOverYears=await FacultyAttendance.find({facultyID:req.headers['dbid']});

            if(facultyAttendanceOverYears.length===0){
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
                return;
            }
            let latestFacultyAttendance=facultyAttendanceOverYears[0];
            let maxYear=facultyAttendanceOverYears[0].year;
            for(const facultyAttendance of facultyAttendanceOverYears){
                if(maxYear<facultyAttendance.year){
                    latestFacultyAttendance=facultyAttendance;
                    maxYear=facultyAttendance.year;
                }
            }

            let dateDifference=getLeaveDifferenceAsNumDays(new Date(arrivalTime),new Date(departureTime));
            if(dateDifference>1 && req.body.leaveTiming!=='full'){
                res.statusCode=400;
                res.json({
                    status:"Bad request"
                });
            }
            if(latestFacultyAttendance.casualLeaves!==0 && dateDifference%3!==0 && req.body.leaveType==='el'){
                res.statusCode=403;
                res.json({
                    status:"You are allowed to apply for individual earned leaves only if you have exhausted your casual leaves"
                });
                return;
            }
            let user=await User.findById(req.headers['dbid']);
            await FacultyLeave.create({
               facultyID:req.headers['dbid'],
               facultyDepartment:user.department,
               reason:req.body.reason,
               leaveType:req.body.leaveType,
               leaveTiming:req.body.leaveTiming,
               departureTime:departureTime,
               arrivalTime:arrivalTime
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