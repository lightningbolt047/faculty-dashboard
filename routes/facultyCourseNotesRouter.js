const express=require('express');

const facultyCourseNotesRouter=express.Router();

const User=require('../models/userSchema');
const FacultyCourseNotes=require('../models/facultyCourseNotesSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');

const getSectionsFromAdvisorAllocationIDs=require('../services/getSectionsFromAdvisorAllocationIDs');
const getCourseNameFromCourseID=require('../services/getCourseNameFromCourseID');
const getFacultyNameFromFacultyID=require('../services/getFacultyNameFromFacultyID');
const checkCoursePresentForFaculty=require('../services/checkCoursePresentForFaculty');
const checkCredentials=require('../services/checkCredentialsService');


facultyCourseNotesRouter.route('/')
    .get(checkCredentials,(req,res,next)=>{
        SemesterProgression.find({facultyID:req.headers['dbid'],sem:process.env.CUR_SEM_TYPE})
            .then(async (semesterProgressions)=>{
                if(!semesterProgressions || semesterProgressions.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"Resource not found"
                    });
                    return;
                }
                let maxYear=semesterProgressions[0].year;
                let latestSemesterProgression=semesterProgressions[0];
                for(let semesterProgression of semesterProgressions){
                    if(semesterProgression.year>=maxYear){
                        maxYear=semesterProgression.year;
                        latestSemesterProgression=semesterProgression;
                    }
                }


                let sendDocument=[];
                try{
                    for(const courseProgression of latestSemesterProgression.courseProgression){
                        let courseDetails={
                            courseName:await getCourseNameFromCourseID(courseProgression.courseID,'courseName'),
                            courseCode:await getCourseNameFromCourseID(courseProgression.courseID,'courseCode'),
                            courseCredits:await getCourseNameFromCourseID(courseProgression.courseID,'courseCredits'),
                            courseType:await getCourseNameFromCourseID(courseProgression.courseID,'courseType')
                        };
                        sendDocument.push(courseDetails);
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
            })
    });

facultyCourseNotesRouter.route('/:courseID')
    .get(checkCredentials,async (req,res,next)=>{
        FacultyCourseNotes.findOne({facultyID:req.headers['dbid'],year:process.env.CUR_ACADEMIC_YEAR,courseID:req.params.courseID,sem:process.env.CUR_SEM_TYPE})
            .then((noteDocument)=>{
                if(typeof noteDocument==='undefined'){
                    res.statusCode=404;
                    res.json([]);
                    return;
                }
                if(typeof noteDocument.notes==='undefined'){
                    res.statusCode=404;
                    res.json({
                        status:"Invalid request"
                    });
                    return;
                }
                res.statusCode=200;
                res.json(noteDocument);
            },(err)=>{
                res.statusCode=500;
                res.json({
                   status:"Internal Server Error"
                });
            });
    })
    .put((req,res,next)=>{
        if(typeof req.body.facultyCourseNotesID==='undefined'){
            FacultyCourseNotes.create({
                facultyID:req.headers['dbid'],
                year:process.env.CUR_ACADEMIC_YEAR,
                sem:process.env.CUR_SEM_TYPE,
                courseID:req.params.courseID,
                notes:[{
                    date: new Date().toISOString(),
                    notes:req.body.noteText
                }]
            })
        }else{
            FacultyCourseNotes.findById(req.body.facultyCourseNotesID)
                .then((document)=>{
                    let notes=[];
                    for(const note in document.notes){
                        notes.push(note);
                    }
                    notes.push({
                        date:new Date().toISOString(),
                        notes:req.body.noteText
                    });
                   FacultyCourseNotes.findByIdAndUpdate(req.body.facultyCourseNotesID, {$set: {'notes': notes}})
                       .then(()=>{
                           res.statusCode=200;
                           res.json({
                               status:"Added new note successfully"
                           });
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
                });
        }
    })
    .post(checkCredentials,(req,res,next)=>{
        FacultyCourseNotes.findById(req.body.facultyCourseNotesID)
            .then((document)=>{
               let notes=document.notes;
               for(const note of document.notes){
                   notes.push(note);
               }
               try{
                   notes[req.body.noteIndex]=req.body.noteText;
                   FacultyCourseNotes.findByIdAndUpdate(req.body.facultyCourseID,{$set:{'notes':notes}})
                       .then(()=>{
                           res.statusCode=200;
                           res.json({
                               status:"Note updated successfully"
                           });
                       },(err)=>{
                           res.statusCode=500;
                           res.json({
                               status:"Internal Server Error"
                           });
                       });
               }catch(e){
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
            });
    })









module.exports=facultyCourseNotesRouter;