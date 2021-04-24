const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const totalLeaveDaysSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    totalCasualLeaves:{
        type:Number,
        required:true
    },
    totalMedicalLeaves:{
        type:Number,
        required:true
    },
    totalEarnedLeaves:{
        type:Number,
        required:true
    }
});

var TotalLeaveDays=mongoose.model('totalLeaveDays',totalLeaveDaysSchema);
module.exports=TotalLeaveDays;