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
            .lean()
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
                        for(let j=0;j<sendForumPosts[i].comments.length;j++){
                            sendForumPosts[i].comments[j].facultyName=await getFacultyNameFromFacultyID(sendForumPosts[i].comments[j].facultyID);
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
            let insertDocument={
                facultyID:req.headers['dbid'],
                courseID:req.params.courseID,
                postText:req.body.postText,
                postDateTime:new Date().toISOString(),
                upvotes:[],
                downvotes:[],
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
    })
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
        if(req.body.reqType==='upvote'){
            ForumPost.findById(req.body.postID)
                .then(async (document)=>{
                    try{
                        if(document.downvotes.includes(req.headers['dbid'])){
                            await ForumPost.findByIdAndUpdate(req.body.postID,{$pull:{'downvotes':req.headers['dbid']}});
                        }
                        if(document.upvotes.includes(req.headers['dbid'])){
                            await ForumPost.findByIdAndUpdate(req.body.postID,{$pull:{'upvotes':req.headers['dbid']}});
                            res.statusCode=200;
                            res.json({
                               status:"Upvote removed successfully"
                            });
                            return;
                        }
                    }catch(e){
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                    }
                    ForumPost.findByIdAndUpdate(req.body.postID,{$push:{'upvotes':req.headers['dbid']}})
                        .then(()=>{
                            res.statusCode=200;
                            res.json({
                                status:"Post upvoted successfully"
                            });
                        },(err)=>{
                            res.statusCode=500;
                            res.json({
                                status:"Internal Server Error"
                            });
                        });
                },(err)=>{
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                })
        }
        else if(req.body.reqType==='downvote'){
            ForumPost.findById(req.body.postID)
                .then(async (document)=>{
                    try{
                        if(document.upvotes.includes(req.headers['dbid'])){
                            await ForumPost.findByIdAndUpdate(req.body.postID,{$pull:{'upvotes':req.headers['dbid']}});
                        }
                        if(document.downvotes.includes(req.headers['dbid'])){
                            await ForumPost.findByIdAndUpdate(req.body.postID,{$pull:{'downvotes':req.headers['dbid']}});
                            res.statusCode=200;
                            res.json({
                                status:"Downvote removed successfully"
                            });
                            return;
                        }
                    }catch(e){
                        res.statusCode=500;
                        res.json({
                            status:"Internal Server Error"
                        });
                    }
                    ForumPost.findByIdAndUpdate(req.body.postID,{$push:{'downvotes':req.headers['dbid']}})
                        .then(()=>{
                            res.statusCode=200;
                            res.json({
                                status:"Post downvoted successfully"
                            });
                        },(err)=>{
                            res.statusCode=500;
                            res.json({
                                status:"Internal Server Error"
                            });
                        });
                },(err)=>{
                    res.statusCode=500;
                    res.json({
                        status:"Internal Server Error"
                    });
                })
        }
    });









module.exports=forumPostRouter;