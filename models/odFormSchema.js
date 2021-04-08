const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const odFormSchema=new Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required: true
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
    },
    affectedClasses:{
        type:[{
            facultyID:{
                type:String,
                required:true
            },
            courseID:{
                type:String,
                required:true
            },
            numClasses:{
                type:Number,
                required:true,
                range:[1-100]
            },
            approvalStatus:{
                type:String,
                enum:['pending','approved','cancelled']
            }
        }],
        required:true
    }
});

var ODFormSchema=mongoose.model('MedicalLeaveRequest',odFormSchema);
module.exports=ODFormSchema;