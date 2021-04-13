const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const facultyCourseNotesSchema=new Schema({
    year:{
        type:Number,
        required:true
    },
    facultyID:{
        type:String,
        ref:'User',
        required:true
    },
    notes:[String] //TODO Give appropriate type for this. For now it is String
});

var FacultyCourseNotes=mongoose.model('FacultyCourseNotes',facultyCourseNotesSchema);
module.exports=FacultyCourseNotes;