const express=require('express');

const forumPostRouter=express.Router();

const User=require('../models/userSchema');
const ForumPost=require('../models/forumPostsSchema');

const getSectionsFromAdvisorAllocationIDs=require('../services/getSectionsFromAdvisorAllocationIDs');
const getCourseNameFromCourseID=require('../services/getCourseNameFromCourseID');
const getFacultyNameFromFacultyID=require('../services/getFacultyNameFromFacultyID');
const checkCoursePresentForFaculty=require('../services/checkCoursePresentForFaculty');
const checkCredentials=require('../services/checkCredentialsService');

forumPostRouter.route('/:courseID')
    .get(checkCredentials,async (req,res,next)=>{
        try{
            if(!await checkCoursePresentForFaculty(req.headers['dbid'],req.params.courseID)){
                res.statusCode=403;
                res.json({
                    status:"You do not have permission to view this content"
                });
                return;
            }
        }catch(e){
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
            return;
        }
        ForumPost.find({courseID:req.params.courseID})
            .then(async (forumPosts)=>{
                if(typeof forumPosts==='undefined' || forumPosts.length===0){
                    res.statusCode=404;
                    res.json({
                        status:"No posts yet"
                    });
                    return;
                }
                forumPosts.sort((a,b)=>{
                    return Date.parse(b.postDateTime)-Date.parse(a.postDateTime);
                });
                let sendForumPosts=forumPosts;
                try{
                    for(let i=0;i<sendForumPosts.length;i++){
                        sendForumPosts[i].facultyName=await getFacultyNameFromFacultyID(sendForumPosts[i].facultyID);
                        sendForumPosts[i].facultyID=undefined;
                        sendForumPosts[i].upVotes=sendForumPosts[i].upVotes.length;
                        sendForumPosts[i].downVotes=sendForumPosts[i].downVotes.length;
                        for(let j=0;j<sendForumPosts.comments.length;j++){
                            sendForumPosts[i].comments[j].facultyName=await getFacultyNameFromFacultyID(sendForumPosts[i].comments[j].facultyID);
                            sendForumPosts[i].comments[j].facultyID=undefined;
                        }
                    }
                    res.statusCode=200;
                    res.json(sendForumPosts);
                }catch(e){
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                }

            },(err)=>{
                res.statusCode=500;
                res.json({
                    status:"Internal Server Error"
                });
            })
    })
    .put(checkCredentials,async (req,res,next)=>{
        try{
            if(!await checkCoursePresentForFaculty(req.headers['dbid'],req.params.courseID)){
                res.statusCode=403;
                res.json({
                    status:"You do not have permission to modify this content"
                });
                return;
            }
        }catch(e){
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
            return;
        }

        if(req.body.reqType==='postComment'){
            ForumPost.findByIdAndUpdate(req.body.postID,{$push:{'comments':{facultyID:req.headers['dbid'],commentText:req.body.commentText}}})
                .then(()=>{
                    res.statusCode=200;
                    res.json({
                        status:"Comment posted successfully"
                    });
                })
        }
        else if(req.body.reqType==='postPost'){
            let curDate=new Date();
            let insertDocument={
                facultyID:req.headers['dbid'],
                courseID:req.body.courseID,
                postText:req.body.postText,
                postDateTime:curDate.toISOString(),
                upVotes:[],
                downVotes:[],
                comments:[]
            };
            ForumPost.create(insertDocument)
                .then(()=>{
                    res.statusCode=200;
                    res.json({
                        status:"Post Created Successfully"
                    });
                },(err)=>{
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                });
        }
    });
forumPostRouter.route('/')
    .post(checkCredentials,async (req,res,next)=>{
        try{
            if(!await checkCoursePresentForFaculty(req.headers['dbid'],req.params.courseID)){
                res.statusCode=403;
                res.json({
                    status:"You do not have permission to upvote/downvote this content"
                });
                return;
            }
        }catch(e){
            res.statusCode=500;
            res.json({
                status:"Internal Server Error"
            });
            return;
        }
        if(req.body.reqType==='upVote'){
            ForumPost.findByIdAndUpdate(req.body.postID,{$push:{'upVotes':req.headers['dbid']}})
                .then(()=>{
                    res.statusCode=200;
                    res.json({
                        status:"Post upVoted successfully"
                    });
                },(err)=>{
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                });
        }
        else if(req.body.reqType==='downVote'){
            ForumPost.findByIdAndUpdate(req.body.postID,{$push:{'downVotes':req.headers['dbid']}})
                .then(()=>{
                    res.statusCode=200;
                    res.json({
                        status:"Post downVoted successfully"
                    });
                },(err)=>{
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                });
        }
    });









module.exports=forumPostRouter;