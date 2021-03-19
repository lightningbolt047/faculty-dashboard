const express=require('express');
const bodyParser=require('body-parser');
const { post } = require('../app');

const mentoringRouter=express.Router();

const User=require('../models/userSchema');
const AdvisorAllocation=require('../models/advisorAllocationSchema');
const Student=require('../models/studentSchema');

const checkCredentials=require('../services/checkCredentialsService');



mentoringRouter.route('/')
.get(checkCredentials,(req,res,next)=>{
    var sendDocument={};
    AdvisorAllocation.find({
        advisorID:req.headers['dbid']
    })
    .then((documents)=>{
        maxYear=documents[0].year;
        var recentDocument;
        for(var i=1;i<documents.length;i++){
            if(maxYear<documents[i].year){
                maxYear=documents[i].year;
                recentDocument=documents[i];
            }
        }
        AdvisorAllocation.findById(recentDocument._id)
        .populate('students.studentID')
        .then((documents)=>{
            
        });
        
    });
})





module.exports=mentoringRouter;