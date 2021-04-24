module.exports=(date1,date2)=>{
    let milliInOneDay=1000*60*60*24;
    let dayDifference=Math.round((date1.getTime()-date2.getTime())/milliInOneDay);
    return parseInt(dayDifference.toFixed(0))+1;
}