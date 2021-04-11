const FacultyAttendance=require('../models/facultyAttendanceSchema');
const TotalWorkingDays=require('../models/totalWorkingDaysSchema');

module.exports=async (facultyID)=>{
    let sendDocument={};
    let facultyAttendances=await FacultyAttendance.find({facultyID:facultyID,sem:process.env.CUR_SEM_TYPE});
    if(typeof facultyAttendances==='undefined'){
        throw 'No such entry';
    }
    if(facultyAttendances.length===0){
        return {};
    }
    let maxYear=facultyAttendances[0].year;
    let latestFacultyAttendance=facultyAttendances[0];
    for(const facultyAttendance of facultyAttendances){
        if(facultyAttendance.year>maxYear){
            latestFacultyAttendance=facultyAttendance;
            maxYear=facultyAttendance.year;
        }
    }
    let totalWorkingDaysDocument=await TotalWorkingDays.findById(latestFacultyAttendance.totalWorkingDaysID);
    sendDocument.totalWorkingDays=totalWorkingDaysDocument.totalWorkingDays;
    sendDocument.totalLeaveDays=latestFacultyAttendance.totalLeaveDays;
    sendDocument.attendedDays=latestFacultyAttendance.attendedDays;
    return sendDocument;
}