const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const odFormSchema=new Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required: true
    },
    advisorID:{
        type:String,
        required:true
    },
    odStatus:{
        type: String,
        enum: ['pending','approved'],
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

var ODForm=mongoose.model('ODForm',odFormSchema);
module.exports=ODForm;