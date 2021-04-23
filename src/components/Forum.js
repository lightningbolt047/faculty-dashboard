import ForumPostAccordion from './ForumPostAccordion';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backendService from "../services/backendService";
import {useEffect, useState} from "react";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


export default function Forum({course}){
    const [open, setOpen] = useState(false);
    const [forumPosts,setForumPosts]=useState([]);
    const [postText,setPostText]=useState("");
    const [commentText,setCommentText]=useState("");
    const [facultyName,setFacultyName]=useState();

    const getForumPostsFromServer=async ()=>{
        let responseBody=await backendService('GET',`/forum/${course.courseID}`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setForumPosts(responseBody);
        }
        responseBody=await backendService('GET',`/profile/getFacultyNameOnly`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        setFacultyName(responseBody.name);
    }

    const sendNewForumPostToServer=async ()=>{

        let responseBody=await backendService('PUT',`/forum/${course.courseID}`,
            {
                reqType:'postPost',
                postText:postText
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        return responseBody.statusCode;
    }

    const sendNewCommentToServer=async (postIndex)=>{
        let responseBody=await backendService('PUT',`/forum/${course.courseID}`,
            {
                postID:forumPosts[postIndex]._id,
                reqType:'postComment',
                commentText:commentText
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        return responseBody.statusCode;
    }

    const sendVoteToServer=async (postIndex,voteType)=>{
        let responseBody=await backendService('POST',`/forum/${course.courseID}`,
            {
                postID:forumPosts[postIndex]._id,
                reqType:voteType
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        return responseBody.statusCode;
    }

    const addNewComment=async (postIndex)=>{
        if(typeof commentText==='undefined' || commentText===""){
            return;
        }
        if(await sendNewCommentToServer(postIndex)===200){
            let tempPosts=[];
            for(const post of forumPosts){
                tempPosts.push(post);
            }
            tempPosts[postIndex].comments.push({
                facultyID:sessionStorage.USER_DB_ID,
                commentText:commentText,
                facultyName:facultyName
            });
            setForumPosts(tempPosts);
            setCommentText("");
        }
    }

    const handleAddNewForumPost=async ()=>{
        if(typeof postText==='undefined' || postText===""){
            return;
        }
        if(await sendNewForumPostToServer()===200){
            getForumPostsFromServer();
            setOpen(false);
            setPostText("");
        }
    }

    const voteClickHandler=async (postIndex,voteType)=>{
        if(await sendVoteToServer(postIndex,voteType)===200){
            let tempPosts=[];
            for(let post of forumPosts){
                tempPosts.push(post);
            }
            let upvoteAlreadyPresent=false;
            for(let i=0;i<tempPosts[postIndex].upvotes.length;i++){
                if(tempPosts[postIndex].upvotes[i]===sessionStorage.USER_DB_ID){
                    upvoteAlreadyPresent=true;
                    tempPosts[postIndex].upvotes=tempPosts[postIndex].upvotes.filter((item)=>item!==sessionStorage.USER_DB_ID);
                    if(voteType==='upvote'){
                        setForumPosts(tempPosts);
                        return;
                    }
                    break;
                }
            }

            let downvoteAlreadyPresent=false;
            for(let i=0;i<tempPosts[postIndex].downvotes.length;i++){
                if(tempPosts[postIndex].downvotes[i]===sessionStorage.USER_DB_ID){
                    downvoteAlreadyPresent=true;
                    tempPosts[postIndex].downvotes=tempPosts[postIndex].downvotes.filter((item)=>item!==sessionStorage.USER_DB_ID);
                    if(voteType==='downvote'){
                        setForumPosts(tempPosts);
                        return;
                    }
                    break;
                }
            }

            if(!upvoteAlreadyPresent || !downvoteAlreadyPresent){
                if(voteType==='upvote'){
                    tempPosts[postIndex].upvotes.push(sessionStorage.USER_DB_ID);
                }else{
                    tempPosts[postIndex].downvotes.push(sessionStorage.USER_DB_ID);
                }
            }

            setForumPosts(tempPosts);
        }

    }

    useEffect(()=>{
        getForumPostsFromServer();
        // eslint-disable-next-line
    },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCommentTextChange=(e)=>{
        if(commentText==="" && e.target.value===" "){
            return;
        }
        setCommentText(e.target.value);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handlePostTextChange=(e)=>{
        if(postText==="" && e.target.value===" "){
            return;
        }
        setPostText(e.target.value);
    }

    return (
        <div>
            <Typography variant="h5" color="secondary">Course Committee Discussions</Typography>
            {forumPosts.map((item,index)=>(
                <ForumPostAccordion key={index} postIndex={index} commentText={commentText} onCommentTextChangeHandler={handleCommentTextChange} postCommentHandler={addNewComment} post={item} voteClickHandler={voteClickHandler}/>
            ))}
            <Box height={10}/>
            <Fab className="floatingBtns" color="secondary" onClick={handleClickOpen}>
                <AddIcon/>
            </Fab>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    <Typography variant="h5" color="secondary">Add New Post</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type out your post here so that same course handling faculties can interact.
                    </DialogContentText>
                    <TextField variant="outlined" value={postText} onChange={handlePostTextChange} color="secondary" label="Post" type="text" fullWidth id={`forumCreatePostTextField`}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary" id={`forumCreatePostTextDiscardButton`}>
                    Cancel
                </Button>
                <Button onClick={handleAddNewForumPost} color="primary" id={`forumCreatePostButton`}>
                    Post
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}