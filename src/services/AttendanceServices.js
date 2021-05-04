class AttendanceServices{
    static getAttendancePercentageTextStyle=(percentage)=>{
        if(percentage<75){
            return 'warningColor';
        }else if(percentage>=75 && percentage<=85){
            return 'alertColor';
        }
        else{
            return 'okColor';
        }
    }

    static getAttendancePercentage=(item)=>{
        try{
            return ((item.studentAttendance/item.classesTaken)*100).toFixed(2);
        }catch (e){
            return '0';
        }
    }
}

export default AttendanceServices;