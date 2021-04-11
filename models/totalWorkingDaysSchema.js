const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const totalWorkingDaysSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    sem:{
        type:Number,
        enum:[0,1],
        required:true
    },
    totalWorkingDays:{
        type:Number,
        required:true
    },
    totalLeaveDays:{
        type:Number,
        default:0
    }
});

var TotalWorkingDays=mongoose.model('totalWorkingDays',totalWorkingDaysSchema);
module.exports=TotalWorkingDays;