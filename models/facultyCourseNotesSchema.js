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
    courseID:{
        type:String,
        ref:'Course',
        required:true
    },
    sem:{
      type:Number,
      enum:[0,1],
      required:true
    },
    notes:{
        type:[{
            date:{
                type:String,
                required:true
            },
            hour:{
                type:Number,
                required:true,
                range:[0,6]
            },
            notes:{
                type:String,
                required:true
            }
        }],
        required:true
    }
});

var FacultyCourseNotesSchema=mongoose.model('FacultyCourseNotes',facultyCourseNotesSchema);
module.exports=FacultyCourseNotesSchema;