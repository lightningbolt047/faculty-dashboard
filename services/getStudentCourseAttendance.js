const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');

module.exports=async (curSem,studentID,facultyID,courseID)=>{
    if(typeof facultyID==='undefined' || typeof courseID==='undefined'){
        throw "Invalid inputs";
    }
    let studentAttendance = await StudentAttendance.findOne({sem: curSem, studentID: studentID});
    let sendDocument=[];
    for(let i=0;i<courseID.length;i++){
        for(let j=0;j<studentAttendance.courseDetails.length;j++){
            if(studentAttendance.courseDetails[j].courseID.toString()===courseID[i].toString()){
                let semesterProgression=await SemesterProgression.findById(studentAttendance.courseDetails[j].semesterProgressionID);
                let classesTaken=0;
                let course=await Course.findById(studentAttendance.courseDetails[j].courseID);
                for(const courseProgression of semesterProgression.courseProgression){
                    if(studentAttendance.courseDetails[j].courseID.toString()===courseProgression.courseID.toString()){
                        classesTaken=courseProgression.classesTaken;
                        break;
                    }
                }
                sendDocument.push({
                    courseName:course.courseName,
                    studentAttendance:studentAttendance.courseDetails[j].classesAttended,
                    classesTaken:classesTaken
                });
            }
        }
    }
    return sendDocument;
}