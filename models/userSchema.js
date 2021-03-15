const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required: true
    },
    clgID:{
        type:String,
        required:true,
        unique:true
    },
    authToken:{
        type:String,
        required:true
    },
    secQuestion:{
        type:String
    },
    secAnswer:{
        type:String
    },
    wrongAttempts:{
        type:Number,
        required:true,
        range: [0,10]
    },
    phoneNumber:{
        type:String,
    },
    address:{
        type:String,
    },
    email:{
        type:String,
        required: true
    },
    imagePath:{
        type: String
    },
    facultyType:{
        type: String,
        required: true
    },
    department:{
        type:String,
        required:true
    },
    hod:{
        type:Boolean
    }
});

var User=mongoose.model('User',userSchema);
module.exports=User;