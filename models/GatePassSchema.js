const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const gatePassSchema=new Schema({
    studentID:{
        type: String,
        required: true
    },
    advisorID:{
        type:String,
        required:true
    },
    passStatus:{
        type: String,
        enum: ['pending','approved','withheld'],
        default:'pending',
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    isEmergency:{
        type:Boolean,
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

var GatePass=mongoose.model('GatePass',gatePassSchema);
module.exports=GatePass;