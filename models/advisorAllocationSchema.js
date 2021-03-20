const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Student=require('./studentSchema');

const advisorAllocationSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    advisorID:{
        type:String,
        ref:'User',
        required:true
    },
    students:{
        type:[
            {
                studentID:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Student'
                },
                mentorText:{
                    type:String
                }
            }
        ],
        required:true
    }
});

var AdvisorAllocation=mongoose.model('AdvisorAllocation',advisorAllocationSchema);
module.exports=AdvisorAllocation;