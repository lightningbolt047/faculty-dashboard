const express=require('express');

const medicalLeaveRouter=express.Router();

const MedicalLeaveRequest=require('../models/medicalLeaveRequestSchema');
const getStudentAttendance=require('../services/getStudentAttendance');

const checkCredentials=require('../services/checkCredentialsService');

medicalLeaveRouter.route('/')
    .get(checkCredentials,(req,res)=>{
        MedicalLeaveRequest.find({advisorID:req.headers['dbid']})
            .populate('studentID')
            .then(async (leaves)=>{
                let sendDocument=[];
                let curDate=Date.now();
                try{
                    for(let i=0;i<leaves.length;i++) {
                        if (curDate > Date.parse(leaves[i].arrivalTime)) {
                            continue;
                        }
                        sendDocument.push({
                            personalDetails: leaves[i].studentID,
                            attendanceDetails: await getStudentAttendance(leaves[i].studentID.curSem,leaves[i].studentID._id),
                            leaveFormDetails: {
                                medicalLeaveStatus: leaves[i].leaveStatus,
                                reason: leaves[i].reason,
                                departureTime: leaves[i].departureTime,
                                arrivalTime: leaves[i].arrivalTime,
                                leaveID: leaves[i]._id
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









module.exports=medicalLeaveRouter;