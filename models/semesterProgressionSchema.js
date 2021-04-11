const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const semesterProgressionSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    facultyID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    courseProgression:{
        type:[{
            courseID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
                unique:true
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