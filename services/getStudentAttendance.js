const StudentAttendance=require('../models/studentAttendance');
const Course=require('../models/courseSchema');
const SemesterProgression=require('../models/semesterProgressionSchema');

module.exports=async (curSem,studentID)=>{
    let studentAttendance = await StudentAttendance.findOne({sem: curSem, studentID: studentID});
    let sendDocument=[];
    for(let j=0;j<studentAttendance.courseDetails.length;j++){
        let course=await Course.findById(studentAttendance.courseDetails[j].courseID);
        let semesterProgression=await SemesterProgression.findById(studentAttendance.courseDetails[j].semesterProgressionID);
        let classesTaken=0;
        for(let k=0;k<semesterProgression.courseProgression.length;k++){
            if(studentAttendance.courseDetails[j].courseID.toString()===semesterProgression.courseProgression[k].courseID.toString()){
                classesTaken=semesterProgression.courseProgression[k].classesTaken;
                break;
            }
        }
        sendDocument.push({
            courseName:course.courseName,
            studentAttendance:studentAttendance.courseDetails[j].classesAttended,
            classesTaken:classesTaken
        });
    }
    return sendDocument;
}