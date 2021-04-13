
const Course=require('../models/courseSchema');


module.exports=async (courseID,attribute)=>{
    if(typeof courseID==='undefined'){
        throw "courseID undefined";
    }
    let courseDocument=await Course.findById(courseID);
    if(attribute==='courseName'){
        return courseDocument.courseName;
    }
    else if(attribute==='courseCode'){
        return courseDocument.courseCode;
    }
    return '0';
}