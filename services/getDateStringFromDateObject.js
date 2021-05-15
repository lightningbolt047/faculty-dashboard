module.exports=(dateObject)=>{
    return `${dateObject.getDate()}/${dateObject.getMonth()+1}/${dateObject.getFullYear()}`;
}