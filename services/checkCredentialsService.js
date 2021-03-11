const User=require('../models/userSchema');


module.exports=checkCredentials=(req,res,next)=>{
    console.log(req.params.dbID);
    User.findById(req.params.dbID)
    .then((user)=>{
        if(!user){
            res.statusCode=404;
            res.json({
                status: "Invalid dbID"
            });
            return;
        }
        if(user.authToken===req.headers['authtoken']){
            next();
        }
        else{
            res.statusCode=401;
            res.json({
                status: "Invalid authToken"
            });
            return;
        }
    });
}