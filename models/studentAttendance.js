const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const studentAttendanceSchema=new Schema({
    sem:{
        type:Number,
        required:true
    },
    studentID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
    courseDetails:{
        type:[{
            semesterProgressionID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'SemesterProgression',
            },
            courseID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
            },
            classesAttended:{
                type:Number,
            }
        }],
        required:true
    }
});

var StudentAttendance=mongoose.model('StudentAttendance',studentAttendanceSchema);
module.exports=StudentAttendance;