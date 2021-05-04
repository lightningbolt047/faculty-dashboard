export default class FacultyLeaveServices{
    static getFacultyLeaveTypeStringFromCode=(leaveTypeCode)=>{
        if(leaveTypeCode==='cl'){
            return "Casual Leave";
        }else if(leaveTypeCode==='el'){
            return "Earned Leave";
        }else{
            return "Medical Leave"
        }
    }

    static getFacultyLeaveTimingStringFromCode=(leaveTimingCode)=>{
        if(leaveTimingCode==='fn'){
            return "Forenoon";
        }else if(leaveTimingCode==='an'){
            return "Afternoon";
        }else{
            return "Full Day"
        }
    }

}