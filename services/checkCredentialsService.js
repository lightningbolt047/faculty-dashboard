const User=require('../models/userSchema');


module.exports=checkCredentials=(req,res,next)=>{
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
    },(err)=>{
        res.statusCode=400;
        if(req.params.dbID==='undefined'){
            res.json({
                status:"Bad request: undefined dbID"
            });
            return;
        }
        res.json({
            status:"Bad request"
        });
    });
}