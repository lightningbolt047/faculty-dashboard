const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const gatePassRouter=express.Router();

const AdvisorAllocation=require('../models/advisorAllocationSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');
const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');
const GatePass=require('../models/GatePassSchema');

const checkCredentials=require('../services/checkCredentialsService');



gatePassRouter.route('/')
    .get((req,res,next)=>{
        let curDate=Date.now();
        GatePass.find({advisorID:req.headers['dbid'],arrivalTime:{$lte:curDate}})
            .populate('studentID')
            .then(async (passes)=>{
                var studentAttendance;
                var sendDocument=[];
                for(let i=0;passes.length;i++){
                    sendDocument.push({
                        personalDetails:passes[i].studentID,
                        passDetails:{
                            passStatus:passes[i].passStatus,
                            reason:passes[i].reason,
                            departureTime:passes[i].departureTime,
                            arrivalTime:passes[i].arrivalTime,
                            passID:passes[i]._id
                        },
                        attendanceDetails:[]
                    });


                    studentAttendance=await StudentAttendance.findOne({sem:passes[i].studentID.curSem,studentID:passes[i].studentID._id});
                    for(let j=0;j<studentAttendance.courseDetails.length;j++){
                        let course=await Course.findById(studentAttendance.courseDetails[j].courseID);
                        let semesterProgression=await SemesterProgression.findById(studentAttendance.courseDetails[j].semesterProgressionID);
                        let classesTaken=0;
                        for(let k=0;k<semesterProgression.courseProgression.length;k++){
                            if(studentAttendance.courseDetails[j].courseID.toString()===semesterProgression.courseProgression[k].courseID.toString()){
                                classesTaken=semesterProgression.courseProgression[k].classesTaken;
                                break;
                            }
                        }
                        sendDocument[i].attendanceDetails.push({
                            courseName:course.courseName,
                            studentAttendance:studentAttendance.courseDetails[j].classesAttended,
                            classesTaken:classesTaken
                        });
                    }

                }
            });
    })




module.exports=gatePassRouter;