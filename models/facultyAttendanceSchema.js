const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const facultyAttendanceSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    facultyID:{
        type:String,
        required:true
    },
    totalLeaveDaysID:{
        type:String,
        required:true,
        ref:'totalLeaveDays'
    },
    casualLeaves:{
        type:Number,
        required:true
    },
    earnedLeaves:{
      type:Number,
      required:true
    },
    medicalLeaves:{
        type:Number,
        required:true
    }
});

var FacultyAttendance=mongoose.model('facultyAttendance',facultyAttendanceSchema);
module.exports=FacultyAttendance;