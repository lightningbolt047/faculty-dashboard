const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const studentSchema=new Schema({
    name:{
        type:String,
        required: true
    },
    clgID:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    curSem:{
        type:Number,
        range:[1,8]
    },
    sgpaList:{
        type:[Number],
        required:true
    },
    disciplinaryActions:{
        type:[String]
    },
    advisorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    bloodGroup:{
        type:String,
        enum:['A+','A-','B+','B-','AB+','AB-','O+','O-','H/H','Unknown'],
        default:'Unknown',
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});

var Student=mongoose.model('Student',studentSchema);
module.exports=Student;