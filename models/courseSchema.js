const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const courseSchema=new Schema({
    courseName:{
        type:String,
        required:true
    },
    courseCode:{
        type:String,
        required:true,
        unique:true
    },
    credits:{
        type:Number,
        required:true
    },
    semester:{
        type:Number,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    courseType:{
        type:String,
        required:true
    }
});

var Course=mongoose.model('Course',courseSchema);
module.exports=Course;