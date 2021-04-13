const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const forumPostSchema=new Schema({
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
    postText:{
        type:String,
        required:true
    },
    upVotes:{
        type:[String],
        ref:'User'
    },
    downVotes:{
        type:[String],
        ref:'User'
    },
    postDateTime:{
        type:Date,
        required:true
    },
    comments:[{
        facultyID:{
            type:String,
            ref:'User'
        },
        commentText:{
            type:String,
            required:true
        }
    }]
});

var ForumPost=mongoose.model('ForumPost',forumPostSchema);
module.exports=ForumPost;