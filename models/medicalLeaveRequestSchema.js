const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const medicalLeaveRequestSchema=new Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required: true
    },
    advisorID:{
        type:String,
        required:true
    },
    leaveStatus:{
        type: String,
        enum: ['pending','approved','cancelled'],
        default:'pending',
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    departureTime:{
        type:Date,
        required:true
    },
    arrivalTime:{
        type:Date,
        required:true
    }
});

var MedicalLeaveRequest=mongoose.model('MedicalLeaveRequest',medicalLeaveRequestSchema);
module.exports=MedicalLeaveRequest;