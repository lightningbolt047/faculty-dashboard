const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const advisorAllocationSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    advisorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    studentIDs:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Student'
        }],
        required:true
    }
});

var AdvisorAllocation=mongoose.model('AdvisorAllocation',advisorAllocationSchema);
module.exports=AdvisorAllocation;