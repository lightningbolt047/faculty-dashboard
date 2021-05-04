const FacultyAttendance=require('../models/facultyAttendanceSchema');
const TotalLeaveDays=require('../models/totalLeaveDaysSchema');
const getMaxYearDocument=require('./getMaxYearDocument');

module.exports=async (facultyID)=>{
    let sendDocument={};
    let facultyAttendances=await FacultyAttendance.find({facultyID:facultyID});
    if(typeof facultyAttendances==='undefined'){
        throw 'No such entry';
    }
    if(facultyAttendances.length===0){
        return {};
    }
    let latestFacultyAttendance=getMaxYearDocument(facultyAttendances);
    sendDocument.totalLeaveDays={};
    sendDocument.facultyLeaveDays={};
    let totalLeaveDaysDocument=await TotalLeaveDays.findById(latestFacultyAttendance.totalLeaveDaysID);
    sendDocument.totalLeaveDays.casualLeaves=totalLeaveDaysDocument.totalCasualLeaves;
    sendDocument.totalLeaveDays.medicalLeaves=totalLeaveDaysDocument.totalMedicalLeaves;
    sendDocument.totalLeaveDays.earnedLeaves=totalLeaveDaysDocument.totalEarnedLeaves;

    sendDocument.facultyLeaveDays.casualLeaves=latestFacultyAttendance.casualLeaves;
    sendDocument.facultyLeaveDays.earnedLeaves=latestFacultyAttendance.earnedLeaves;
    sendDocument.facultyLeaveDays.medicalLeaves=latestFacultyAttendance.medicalLeaves;
    return sendDocument;
}