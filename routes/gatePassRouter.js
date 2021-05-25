const express=require('express');

const gatePassRouter=express.Router();

const GatePass=require('../models/gatePassSchema');
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
        GatePass.findByIdAndUpdate(req.body.passID,{
            $set:{'passStatus':req.body.passStatus},
        },{runValidators:true})
            .then((document)=>{
                if(!document){
                    res.statusCode=404;
                    res.json({
                       status:'Invalid passID'
                    });
                    return;
                }
                res.statusCode=200;
                res.json({
                   status:'Pass Status updated successfully'
                });
            },()=>{
                res.statusCode=400;
                res.json({
                    'status':"Bad request"
                });
            })
    })




module.exports=gatePassRouter;