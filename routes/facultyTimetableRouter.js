const express=require('express');

const facultyTimetableRouter=express.Router();

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
                let timetableDocument=documents[0];
                for(let i=0;i<documents.length;i++){
                    if(maxYear<=documents[i].year && documents[i]===process.env.CUR_SEM_TYPE){
                        timetableDocument=documents[i];
                        maxYear=documents[i].year;
                    }
                }

                if(typeof timetableDocument.timetable==='undefined' || timetableDocument.timetable.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"There is no Timetable for you"
                    });
                }
                let sendTimetable=[];
                try{
                    for(let i=0;i<timetableDocument.timetable.length;i++){
                        sendTimetable.push([]);
                        for(let j=0;j<timetableDocument.timetable[i].length;j++){
                            sendTimetable[i].push({
                                hour:timetableDocument.timetable[i][j].hour,
                                courseName:await getCourseNameFromCourseID(timetableDocument.timetable[i][j].courseID,'courseName'),
                                courseCode:await getCourseNameFromCourseID(timetableDocument.timetable[i][j].courseID,'courseCode'),
                                section:await getSectionsFromAdvisorAllocationIDs(timetableDocument.timetable[i][j].advisorAllocationIDs)
                            });
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








module.exports=facultyTimetableRouter;