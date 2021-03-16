const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const courseMentorSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    semester:{
        type:Number,
        required:true
    },
    facultyID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    }
});

var CourseMentor=mongoose.model('CourseMentor',courseMentorSchema);
module.exports=CourseMentor;