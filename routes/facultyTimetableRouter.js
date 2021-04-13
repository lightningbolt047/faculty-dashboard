const express=require('express');

const facultyTimetableRouter=express.Router();

const User=require('../models/userSchema');
const FacultyTimetable=require('../models/facultyTimetableSchema');

const getSectionsFromAdvisorAllocationIDs=require('../services/getSectionsFromAdvisorAllocationIDs');
const getCourseNameFromCourseID=require('../services/getCourseNameFromCourseID');
const checkCredentials=require('../services/checkCredentialsService');

facultyTimetableRouter.route('/')
    .get(checkCredentials,(req,res,next)=>{
        FacultyTimetable.find({facultyID:req.headers['dbid']})
            .then(async (documents)=>{
                if(!documents || documents.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"No timetable found"
                    });
                    return;
                }
                let maxYear=documents[0].year;
                let timetableDocument;
                for(let i=0;i<documents.length;i++){
                    if(maxYear<=documents[i].year && documents[i]===process.env.CUR_SEM_TYPE){
                        timetableDocument=documents[i];
                        maxYear=documents[i].year;
                    }
                }

                let sendTimetable=timetableDocument.timetable;
                if(typeof sendTimetable==='undefined' || sendTimetable.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"There is no Timetable for you"
                    });
                }
                try{
                    for(let i=0;i<sendTimetable.length;i++){
                        for(let j=0;j<sendTimetable[i].length;j++){
                            sendTimetable[i][j].courseName=await getCourseNameFromCourseID(sendTimetable[i][j].courseID,'courseName');
                            sendTimetable[i][j].courseCode=await getCourseNameFromCourseID(sendTimetable[i][j].courseID,'courseCode');
                            sendTimetable[i][j].sections=await getSectionsFromAdvisorAllocationIDs(sendTimetable[i][j].advisorAllocationIDs);
                            sendTimetable[i][j].courseID=undefined;
                            sendTimetable[i][j].advisorAllocationIDs=undefined;
                        }
                    }
                    res.statusCode=200;
                    res.json(sendTimetable);
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
            })
    });








module.exports=facultyLeaveApplyRouter;