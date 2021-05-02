const express=require('express');

const facultyCourseNotesRouter=express.Router();

const FacultyCourseNotes=require('../models/facultyCourseNotesSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');

const getCourseNameFromCourseID=require('../services/getCourseNameFromCourseID');
const getSectionsFromAdvisorAllocations=require('../services/getSectionsFromAdvisorAllocationIDs');
const checkCredentials=require('../services/checkCredentialsService');
const checkCoursePresentForFaculty=require('../services/checkCoursePresentForFaculty');


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
                            courseType:await getCourseNameFromCourseID(courseProgression.courseID,'courseType'),
                            sections:await getSectionsFromAdvisorAllocations(courseProgression.advisorAllocationID),
                            courseID:courseProgression.courseID
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
    })

facultyCourseNotesRouter.route('/:courseID')
    .get(checkCredentials,async (req,res,next)=>{
        FacultyCourseNotes.findOne({facultyID:req.headers['dbid'],year:process.env.CUR_ACADEMIC_YEAR,courseID:req.params.courseID,sem:process.env.CUR_SEM_TYPE})
            .then((noteDocument)=>{
                if(typeof noteDocument==='undefined' || noteDocument==null){
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
    .put(checkCredentials,async (req,res,next)=>{

        const exists=await FacultyCourseNotes.exists({_id:req.body.facultyCourseNotesID});
        if(!exists){
            FacultyCourseNotes.create({
                facultyID:req.headers['dbid'],
                year:process.env.CUR_ACADEMIC_YEAR,
                sem:process.env.CUR_SEM_TYPE,
                courseID:req.params.courseID,
                notes:[{
                    date: new Date(req.body.noteDate),
                    hour:req.body.hour,
                    notes:req.body.noteText
                }]
            })
            .then((document)=>{
                res.statusCode=200;
                res.json({
                   status:"Successfully added new course notes document",
                   facultyCourseNotesID:document._id,
                   noteID:document.notes[0]._id
                });
            },(err)=>{
                res.statusCode=500;
                res.json({
                   status:"Internal Server Error"
                });
            });
        }else{
            FacultyCourseNotes.findByIdAndUpdate(req.body.facultyCourseNotesID, {$push: {'notes': {date:new Date(req.body.noteDate),hour:req.body.hour,notes:req.body.noteText}}})
                .then(async (document)=>{
                    try{
                        let noteID;
                        let updatedDocument=await FacultyCourseNotes.findById(document._id);
                        if(updatedDocument.notes.length===0){
                            noteID=0;
                        }else{
                            noteID=updatedDocument.notes[updatedDocument.notes.length-1]._id;
                        }
                        res.statusCode=200;
                        res.json({
                            status:"Added new note successfully",
                            noteID:noteID,
                            facultyCourseNotesID:updatedDocument._id
                        });
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
    .delete(checkCredentials,async (req,res,next)=>{
        try{
            if(await checkCoursePresentForFaculty(req.headers['dbid'],req.params.courseID)){
                FacultyCourseNotes.findByIdAndUpdate(req.body.facultyCourseNotesID,{
                   $pull:{
                       'notes': {_id:req.body.noteID}
                   }
                })
                    .then(()=>{
                        res.statusCode=200;
                        res.json({
                            status:"Note deleted successfully"
                        });
                    },(err)=>{
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                    });
            }
        }catch(e){
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
        }
    })









module.exports=facultyCourseNotesRouter;