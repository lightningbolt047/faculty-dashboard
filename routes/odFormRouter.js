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
                        let facultyCourseID;
                        for(let j=0;j<forms[i].affectedClasses.length;j++){
                            if(forms[i].affectedClasses[j].facultyID===req.headers['dbid']){
                                facultyCourseID=forms[i].affectedClasses[j].courseID;
                                break;
                            }
                        }
                        try{
                            sendDocument.push({
                                personalDetails: forms[i].studentID,
                                attendanceDetails: await getStudentCourseAttendance(forms[i].studentID.curSem,forms[i].studentID._id,req.headers['dbid'],facultyCourseID),
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









module.exports=odFormRouter;