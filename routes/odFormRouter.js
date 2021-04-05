const express=require('express');

const odFormRouter=express.Router();

const ODForm=require('../models/odFormSchema');
const getStudentAttendance=require('../services/getStudentAttendance');

const checkCredentials=require('../services/checkCredentialsService');

odFormRouter.route('/')
    .get(checkCredentials,(req,res)=>{
        ODForm.find({advisorID:req.headers['dbid']})
            .populate('studentID')
            .then(async (forms)=>{
                let sendDocument=[];
                let curDate=Date.now();
                try{
                    for(let i=0;i<forms.length;i++) {
                        if (curDate > Date.parse(forms[i].arrivalTime)) {
                            continue;
                        }
                        sendDocument.push({
                            personalDetails: forms[i].studentID,
                            attendanceDetails: await getStudentAttendance(forms[i].studentID.curSem,forms[i].studentID._id),
                            odFormDetails: {
                                odStatus: forms[i].passStatus,
                                reason: forms[i].reason,
                                departureTime: forms[i].departureTime,
                                arrivalTime: forms[i].arrivalTime,
                                odID: forms[i]._id
                            }
                        });
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