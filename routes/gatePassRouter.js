const express=require('express');

const gatePassRouter=express.Router();

const GatePass=require('../models/GatePassSchema');
const getStudentAttendance=require('../services/getStudentAttendance');

const checkCredentials=require('../services/checkCredentialsService');



gatePassRouter.route('/')
    .get(checkCredentials,(req,res)=>{
        GatePass.find({advisorID:req.headers['dbid']})
            .populate('studentID')
            .then(async (passes)=>{
                let sendDocument=[];
                let curDate=Date.now();
                for(let i=0;i<passes.length;i++){
                    if(curDate>Date.parse(passes[i].arrivalTime)){
                        continue;
                    }
                    sendDocument.push({
                        personalDetails:passes[i].studentID,
                        passDetails:{
                            passStatus:passes[i].passStatus,
                            reason:passes[i].reason,
                            emergencyPass:passes[i].isEmergency,
                            departureTime:passes[i].departureTime,
                            arrivalTime:passes[i].arrivalTime,
                            passID:passes[i]._id
                        },
                        attendanceDetails:await getStudentAttendance(passes[i].studentID.curSem,passes[i].studentID._id)
                    });
                }
                res.statusCode=200;
                res.json(sendDocument);
            },()=>{
                res.statusCode=500;
                res.json({
                    'status':"Internal Server Error"
                });
            });
    })
    .post(checkCredentials,(req,res)=>{
        GatePass.findById(req.body.passID)
            .then((document)=>{
                if(!document){
                    res.statusCode=404;
                    res.json({
                       status:'Invalid passID'
                    });
                    return;
                }
                document.passStatus=req.body.passStatus;
                document.save()
                    .then(()=>{
                        res.statusCode=200;
                        res.json({
                            'status':'Pass status updated successfully'
                        });
                    },()=>{
                        res.statusCode=400;
                        res.json({
                            'status':"Bad request"
                        });
                    })
            },()=>{
                res.statusCode=400;
                res.json({
                    'status':"Bad request"
                })
            })
    })




module.exports=gatePassRouter;