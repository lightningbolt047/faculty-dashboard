const User=require('../models/userSchema');


module.exports=async (user,res)=>{
    if(user.wrongAttempts>=10){
        let timeDiff=Date.now()-user.accountLockTime;
        let responseSent=false;
        let timeRemaining=12-(((timeDiff)/(1000*60*60)).toFixed(2));
        let hoursRemaining=Math.floor(timeRemaining);
        let minutesRemaining=Math.floor((timeRemaining-Math.floor(timeRemaining))*60);
        if(timeRemaining>0){
            res.statusCode=401;
            res.json({
                "status":"Account locked! Try after "+hoursRemaining+":"+minutesRemaining+" hours",
                "remainingAttempts":0
            });
            responseSent=true;
            return responseSent;
        }
        await User.findByIdAndUpdate(user._id,{
            $set:{
                'wrongAttempts':0
            }
        });
        return responseSent;
    }
}