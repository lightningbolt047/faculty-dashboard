const User=require('../models/userSchema');


module.exports=(req,res,next)=>{
    if(typeof req.headers['dbid']==='undefined' || typeof req.headers['authtoken']==='undefined'){
        res.statusCode=400;
        res.json({
            status:"Bad Request"
        });
    }
    User.findById(req.headers['dbid'])
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
        if(typeof req.headers['dbid']==='undefined' || req.headers['dbid']==='undefined'){
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