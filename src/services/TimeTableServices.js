class TimeTableServices{
    static hourStartTimes=['8.50 AM','9:50 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM'];
    static hourEndTimes=['9:40 AM','10:40 AM','11:50 AM','12:50 PM','3:00 PM','4:00 PM','5:00 PM'];
    static getTimeRangeFromHour=(hour)=>{
        if(typeof hour==='undefined'){
            return "NA";
        }
        try{
            return TimeTableServices.hourStartTimes[hour]+" to "+TimeTableServices.hourEndTimes[hour];
        }catch (e){
            return "NA";
        }
    }
}

export default TimeTableServices;