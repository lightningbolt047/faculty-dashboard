const User=require('../models/userSchema');

const sendMail=require('../services/mailService');

module.exports=(user,res)=>{
    if(user.wrongAttempts==9 && user.wrongAttempts+1==10){
        sendMail(user.email,"Your Dashboard Account has been Locked","Your Dashboard account was locked due to the following suspicious activity\n\n\nWrong Password was entered 10 times\n\n\nYou may try to access your account after 12 hours or contact dashboard support for possible faster recovery of your account")
    }
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