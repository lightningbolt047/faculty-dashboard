const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const semesterProgressionSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    facultyID:{
        type:String,
        ref:'User',
        required:true
    },
    courseProgression:{
        type:[{
            advisorAllocationID:{
                type:[String],
                ref:'AdvisorAllocation'
            },
            courseID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
            },
            classesTaken:{
                type:Number,
            }
        }],
        required:true
    },
    sem:{
        type:Number,
        enum:[0,1],
        required:true
    }
});

var SemesterProgression=mongoose.model('SemesterProgression',semesterProgressionSchema);
module.exports=SemesterProgression;