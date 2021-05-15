const daysOfWeek=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
module.exports=(date)=>{
    return daysOfWeek[date.getDay()];
}