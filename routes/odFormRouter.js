const express=require('express');

const odFormRouter=express.Router();

const ODForm=require('../models/odFormSchema');
const getStudentAttendance=require('../services/getStudentAttendance');
const getStudentCourseAttendance=require('../services/getStudentCourseAttendance');

const checkCredentials=require('../services/checkCredentialsService');

odFormRouter.route('/')
    .get(checkCredentials,(req,res)=>{
        ODForm.find({"affectedClasses.facultyID":req.headers['dbid']})
            .populate('studentID')
            .then(async (forms)=>{
                let sendDocument=[];
                let curDate=Date.now();
                try{
                    for(let i=0;i<forms.length;i++) {
                        if (curDate > Date.parse(forms[i].arrivalTime)) {
                            continue;
                        }
                        let facultyCourseIDs=[];
                        for(let j=0;j<forms[i].affectedClasses.length;j++){
                            if(forms[i].affectedClasses[j].facultyID===req.headers['dbid']){
                                facultyCourseIDs.push(forms[i].affectedClasses[j].courseID);
                            }
                        }
                        try{
                            sendDocument.push({
                                personalDetails: forms[i].studentID,
                                attendanceDetails: await getStudentCourseAttendance(forms[i].studentID.curSem,forms[i].studentID._id,req.headers['dbid'],facultyCourseIDs),
                                passDetails:{
                                    reason:forms[i].reason,
                                    affectedClasses:forms[i].affectedClasses,
                                    departureTime:forms[i].departureTime,
                                    arrivalTime:forms[i].arrivalTime,
                                    passID:forms[i]._id
                                }
                            });
                        }catch(e){
                            res.statusCode=404;
                            res.json({
                                'status':"Invalid data"
                            });
                        }
                    }
                }catch(e){
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                    return;
                }
                res.statusCode=200;
                res.json(sendDocument);
            });
    })
    .post((req,res,next)=>{
        ODForm.findById(req.body.passID)
            .then((pass)=>{
               for(let i=0;i<pass.affectedClasses.length;i++){
                   if(pass.affectedClasses[i].facultyID===req.headers['dbid']){
                       pass.affectedClasses[i].approvalStatus=req.body.passStatus;
                   }
                }
               let newAffectedClasses=pass.affectedClasses;
               ODForm.findByIdAndUpdate(req.body.passID,{$set:{'affectedClasses':newAffectedClasses}})
                   .then(()=>{
                       res.statusCode=200;
                       res.json({
                           status:"OD Form updated successfully"
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
    })









module.exports=odFormRouter;