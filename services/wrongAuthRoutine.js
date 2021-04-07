const User=require('../models/userSchema');

module.exports=(user,res)=>{
    user.wrongAttempts++;
    if(user.wrongAttempts>=10){
        user.accountLockTime=new Date(Date.now());
    }
    User.findByIdAndUpdate(user._id,user)
        .then((user)=>{
            res.statusCode=401;
            res.json({
                "status": `Wrong Password Remaining Attempts: ${10-user.wrongAttempts}`,
            });
        });
}