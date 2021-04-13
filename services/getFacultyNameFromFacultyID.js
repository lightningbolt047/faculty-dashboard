const User=require('../models/userSchema');

module.exports=async (facultyID)=>{
    if(typeof facultyID==='undefined'){
        throw 'Invalid facultyID';
    }
    let facultyDocument=await User.findById(facultyID);
    return facultyDocument.name;
}