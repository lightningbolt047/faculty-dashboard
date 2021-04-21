class DateServices{
    static dateToISO=(inputDate)=>{
        if(inputDate!=='' && typeof inputDate!=='undefined'){
            return new Date(inputDate).toISOString();
        }
    }
    static getDateTimeAsString=(dateTime)=>{
        return `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()} ${dateTime.getHours().toString().length<2?0+dateTime.getHours().toString():dateTime.getHours().toString()}:${dateTime.getMinutes().toString().length<2?0+dateTime.getMinutes().toString():dateTime.getMinutes().toString()}`
    }
}

export default DateServices;