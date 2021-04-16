import ForumPostAccordion from './ForumPostAccordion';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backendService from "../services/backendService";
import {useEffect, useState} from "react";



export default function Forum({course}){

    const [forumPosts,setForumPosts]=useState([]);


    const getForumPostsFromServer=async ()=>{
        let responseBody=await backendService('GET',`/forum/${course.courseID}`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setForumPosts(responseBody);
        }
    }

    const voteClickHandler=(postIndex,voteType)=>{
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

    useEffect(()=>{
        getForumPostsFromServer();
        // eslint-disable-next-line
    },[]);

    return (
        <div>
            <Typography variant="h5" color="secondary">Forum</Typography>
            {forumPosts.map((item,index)=>(
                <ForumPostAccordion postIndex={index} post={item} voteClickHandler={voteClickHandler}/>
            ))}
            <Box height={10}/>
            <Fab className="floatingBtns" color="secondary">
                <AddIcon/>
            </Fab>
        </div>
    );
}