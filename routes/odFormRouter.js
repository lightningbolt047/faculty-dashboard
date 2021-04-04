const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const odFormRouter=express.Router();

const AdvisorAllocation=require('../models/advisorAllocationSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');
const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');
const ODForm=require('../models/odFormSchema');

const checkCredentials=require('../services/checkCredentialsService');

odFormRouter.route('/')
    .get((req,res,next)=>{
        let curDate=Date.now()
        ODForm.find({advisorID:req.headers['dbid'],arrivalTime:{$lte:curDate}})
            .populate('studentID')
            .then((forms)=>{

            });
    })









module.exports=odFormRouter;