const express=require('express');

const mentoringRouter=express.Router();

const AdvisorAllocation=require('../models/advisorAllocationSchema');
const getStudentAttendance=require('../services/getStudentAttendance');

const checkCredentials=require('../services/checkCredentialsService');



mentoringRouter.route('/')
.get(checkCredentials,(req,res)=>{
    AdvisorAllocation.find({
        advisorID:req.headers['dbid']
    })
    .then((documents)=>{
        if(!documents || documents.length===0){
            res.statusCode=404;
            res.json({
                status:"Resource Not found"
            });
            return;
        }
        let maxYear=documents[0].year;
        let recentDocumentID=documents[0]._id;
        for(let i=0;i<documents.length;i++){
            if(maxYear<documents[i].year){
                maxYear=documents[i].year;
                recentDocumentID=documents[i]._id;
            }
        }      


        AdvisorAllocation.findById(recentDocumentID)
        .populate('students.studentID')
        .then(async (document)=>{
            try{
                let sendDocument=[];
                for(let i=0;i<document.students.length;i++){
                    sendDocument.push({
                        advisorAllocationID:document._id,
                        personalDetails:document.students[i],
                        attendanceDetails:await getStudentAttendance(document.students[i].studentID.curSem,document.students[i].studentID._id)
                    });
                }
                res.statusCode=200;
                res.json(sendDocument);
            }catch(e){
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
            }
        },()=>{
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
        });
        
    });
})

.post(checkCredentials,(req,res)=>{

    AdvisorAllocation.findById(req.body.advisorAllocationID)
    .then((document)=>{
        if(!document){
            res.statusCode=404;
            res.json({
                status:"Not found"
            });
            return;
        }
        let studentExists=false;
        for(let i=0;i<document.students.length;i++){
            if(document.students[i].studentID.toString()===req.body.studentID.toString()){
                document.students[i].mentorText=req.body.mentorText;
                studentExists=true;
            }
        }
        if(!studentExists){
            res.statusCode=404;
            res.json({
               'status':'No such student'
            });
            return;
        }
        document.save()
        .then(()=>{
            res.statusCode=200;
            res.json({
                status:"Mentor text updated successfully"
            });
        },()=>{
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
        });
    },()=>{
        res.statusCode=500;
        res.json({
            status:"Internal Server Error"
        });
    });
});





module.exports=mentoringRouter;