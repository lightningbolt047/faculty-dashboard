const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const mentoringRouter=express.Router();

const AdvisorAllocation=require('../models/advisorAllocationSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');
const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');

const checkCredentials=require('../services/checkCredentialsService');



mentoringRouter.route('/')
.get(checkCredentials,(req,res,next)=>{
    AdvisorAllocation.find({
        advisorID:req.headers['dbid']
    })
    .then((documents)=>{
        maxYear=documents[0].year;
        var recentDocument;
        for(let i=1;i<documents.length;i++){
            if(maxYear<documents[i].year){
                maxYear=documents[i].year;
                recentDocument=documents[i];
            }
        }
        AdvisorAllocation.findById(recentDocument._id)
        .populate('students.studentID')
        .then(async (document)=>{
            var studentAttendance;
            var sendDocument=[];
            for(let i=0;i<document.students.length;i++){
                sendDocument.push({
                    personalDetails:document.students,
                    attendanceDetails:[]
                });
                studentAttendance=await StudentAttendance.findOne({sem:document.students[i],studentID:document.students[i]._id});
                for(let j=0;j<studentAttendance.courseDetails.length;j++){
                    let courseName=await Course.findById(studentAttendance.courseDetails[j].courseID).courseName;
                    sendDocument[i].attendanceDetails.push({
                        courseName:courseName,
                        studentAttendance:studentAttendance.courseDetails[j].classesAttended
                    });
                    let semesterProgression=await SemesterProgression.findById(studentAttendance.courseDetails[j].semesterProgressionID);
                    for(let k=0;k<semesterProgression.courseProgression.length;k++){
                        if(studentAttendance.courseDetails[j].courseID===semesterProgression.courseProgression[k].courseID){
                            sendDocument[i].attendanceDetails[j].classesTaken=semesterProgression.courseProgression[k].classesTaken;
                        }
                    }
                }
            }
            res.statusCode=200;
            res.json(sendDocument);
        });
        
    });
})





module.exports=mentoringRouter;