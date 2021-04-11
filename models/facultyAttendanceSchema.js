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
    year:{
        type:Number,
        required:true
    },
    sem:{
        type:Number,
        enum:[0,1],
        required:true
    },
    totalWorkingDaysID:{
        type:String,
        required:true
    },
    totalLeaveDays:{
        type:Number,
        required:true
    },
    attendedDays:{
        type:Number,
        required:true
    }
});

var FacultyAttendance=mongoose.model('facultyAttendance',facultyAttendanceSchema);
module.exports=FacultyAttendance;