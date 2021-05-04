const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const facultyTimetableSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    facultyID:{
        type:String,
        ref:'User',
        required:true
    },
    sem:{
        type:Number,
        enum:[0,1],
        required:true
    },
    timetable:[[{
        hour:{
            type:Number,
            required:true,
            enum:[0,1,2,3,4,5,6]
        },
        courseID:{
            type:String,
            required:true,
            ref:'Course'
        },
        advisorAllocationIDs:{
            type:[String],
            required:true,
            ref:'AdvisorAllocation'
        }
    }]]
});

var FacultyTimetable=mongoose.model('FacultyTimetable',facultyTimetableSchema);
module.exports=FacultyTimetable;