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
        if(!documents || documents.length===0){
            res.statusCode=404;
            res.json({
                status:"Resource Not found"
            });
            return;
        }
        maxYear=documents[0].year;
        var recentDocumentID=documents[0]._id;
        for(let i=0;i<documents.length;i++){
            if(maxYear<documents[i].year){
                maxYear=documents[i].year;
                recentDocument=documents[i]._id;
            }
        }      


        AdvisorAllocation.findById(recentDocumentID)
        .populate('students.studentID')
        .then(async (document)=>{
            try{
                var studentAttendance;
                var sendDocument=[];
                for(let i=0;i<document.students.length;i++){
                    sendDocument.push({
                        personalDetails:document.students[i],
                        attendanceDetails:[]
                    });
            

                    studentAttendance=await StudentAttendance.findOne({sem:document.students[i].studentID.curSem,studentID:document.students[i].studentID._id});
                    for(let j=0;j<studentAttendance.courseDetails.length;j++){
                        let course=await Course.findById(studentAttendance.courseDetails[j].courseID);
                        let courseName=course.courseName;
                        let semesterProgression=await SemesterProgression.findById(studentAttendance.courseDetails[j].semesterProgressionID);
                        let classesTaken=0;
                        for(let k=0;k<semesterProgression.courseProgression.length;k++){
                            if(studentAttendance.courseDetails[j].courseID.toString()===semesterProgression.courseProgression[k].courseID.toString()){
                                classesTaken=semesterProgression.courseProgression[k].classesTaken;
                                break;
                            }
                        }
                        sendDocument[i].attendanceDetails.push({
                            courseName:courseName,
                            studentAttendance:studentAttendance.courseDetails[j].classesAttended,
                            classesTaken:classesTaken
                        });
                    }
                }
                res.statusCode=200;
                res.json(sendDocument);
            }catch(e){
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
            }
        },(err)=>{
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
        });
        
    });
})

.post(checkCredentials,(req,res,next)=>{
    AdvisorAllocation.find({
        advisorID:req.headers['dbid']
    })
    .then((documents)=>{
        if(!documents || documents.length===0){
            res.statusCode=404;
            res.json({
                status:"Resource Not found"
            });
            return;
        }
        maxYear=documents[0].year;
        var recentDocumentID=documents[0]._id;
        for(let i=0;i<documents.length;i++){
            if(maxYear<documents[i].year){
                maxYear=documents[i].year;
                recentDocument=documents[i]._id;
            }
        }      
        AdvisorAllocation.findById(recentDocumentID)
        .then((document)=>{
            for(let i=0;i<document.students.length;i++){
                if(document.students[i].studentID.toString()===req.body.studentID.toString()){
                    document.students[i].mentorText=req.body.mentorText;
                }
            }
            document.save()
            .then(()=>{
                res.statusCode=200;
                res.json({
                    status:"Mentor text updated successfully"
                });
            },(err)=>{
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
            });
        },(err)=>{
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
        });
    },(err)=>{
        res.statusCode=500;
        res.json({
            status:"Internal Server Error"
        });
    });
});





module.exports=mentoringRouter;