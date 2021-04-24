const FacultyAttendance=require('../models/facultyAttendanceSchema');
const TotalLeaveDays=require('../models/totalLeaveDaysSchema');

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
    sendDocument.totalLeaveDays={};
    sendDocument.facultyLeaveDays={};
    let totalLeaveDaysDocument=await TotalLeaveDays.findById(latestFacultyAttendance.totalWorkingDaysID);
    sendDocument.totalLeaveDays.casualLeaves=totalLeaveDaysDocument.totalCasualLeaves;
    sendDocument.totalLeaveDays.medicalLeaves=totalLeaveDaysDocument.totalMedicalLeaves;
    sendDocument.totalLeaveDays.EarnedLeaves=totalLeaveDaysDocument.totalEarnedLeaves;

    sendDocument.facultyLeaveDays.casualLeaves=facultyAttendances.casualLeaves;
    sendDocument.facultyLeaveDays.EarnedLeaves=facultyAttendances.EarnedLeaves;
    sendDocument.facultyLeaveDays.medicalLeaves=facultyAttendances.medicalLeaves;
    return sendDocument;
}