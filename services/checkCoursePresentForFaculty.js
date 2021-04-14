
const SemesterProgression=require('../models/semesterProgressionSchema');

module.exports=async (facultyID,courseID)=>{
    if(typeof courseID==='undefined'){
        throw "Invalid courseID";
    }
    let allFacultySemProgression=await SemesterProgression.find({facultyID:facultyID,sem:process.env.CUR_SEM_TYPE});
    if(typeof allFacultySemProgression==='undefined' || allFacultySemProgression.length===0){
        return false;
    }
    let semProgressionDocument;
    let maxYear=allFacultySemProgression[0];
    for(const semProgression of allFacultySemProgression){
        if(maxYear<semProgression.year){
            maxYear=semProgression.year;
            semProgressionDocument=semProgression;
        }
    }
    for(const course of semProgressionDocument.courseProgression){
        if(course.courseID===courseID){
            return true;
        }
    }
    return false;
}