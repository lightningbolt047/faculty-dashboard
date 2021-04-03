const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const mentoringRouter=express.Router();

const AdvisorAllocation=require('../models/advisorAllocationSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');
const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');
const GatePass=require('../models/GatePassSchema');

const checkCredentials=require('../services/checkCredentialsService');



mentoringRouter.route('/')
    .get((req,res,next)=>{
        let curDate=Date.now();
        GatePass.find({arrivalTime:{$lte:curDate}})
            .then((passes)=>{

            });
    })




module.exports=mentoringRouter;