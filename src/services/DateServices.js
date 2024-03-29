class DateServices{
    static daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


    static dateToISO=(inputDate)=>{
        if(inputDate!=='' && typeof inputDate!=='undefined'){
            return new Date(inputDate).toISOString();
        }
    }
    static getDateTimeAsString=(dateTime)=>{
        return `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()} ${dateTime.getHours().toString().length<2?0+dateTime.getHours().toString():dateTime.getHours().toString()}:${dateTime.getMinutes().toString().length<2?0+dateTime.getMinutes().toString():dateTime.getMinutes().toString()}`
    }
    static getDateAsString=(dateTime)=>{
        return `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`;
    }
    static getDateDifference=(date1,date2)=>{
        let milliInOneDay=1000*60*60*24;
        let dayDifference=Math.round((date1.getTime()-date2.getTime())/milliInOneDay);
        if(isNaN(parseInt(dayDifference.toFixed(0))+1)){
            return 0;
        }
        return parseInt(dayDifference.toFixed(0))+1;
    }
    static getDayStringFromDateObject=(date)=>{
        return DateServices.daysOfWeek[date.getDay()];
    }

}

export default DateServices;