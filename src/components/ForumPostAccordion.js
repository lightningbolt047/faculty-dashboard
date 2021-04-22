import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';


export default function ForumPostAccordion({postIndex,post,commentText,onCommentTextChangeHandler,postCommentHandler,voteClickHandler}){

    const getUpvoteButtonVariant=()=>{
        for(const facultyID of post.upvotes){
            if(facultyID===sessionStorage.USER_DB_ID){
                return "default";
            }
        }
        return "outlined";
    }

    const getDownvoteButtonVariant=()=>{
        for(const facultyID of post.downvotes){
            if(facultyID===sessionStorage.USER_DB_ID){
                return "default";
            }
        }
        return "outlined";
    }

    const upvoteClick = (event) => {
        event.stopPropagation();
        voteClickHandler(postIndex,'upvote');
    };
    
    const downvoteClick = (event) => {
        event.stopPropagation();
        voteClickHandler(postIndex,'downvote');
    };


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary id={`forumPostAccordion${postIndex}`} expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{post.facultyName}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={2}>
                        <Typography className="accordionText" id="accordionTextSecondary">{post.postText}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Chip icon={<ThumbUpIcon/>} label={post.upvotes.length} clickable color="primary" onClick={upvoteClick} variant={getUpvoteButtonVariant()} id={`forumPostAccordionUpvote${postIndex}`}/>
                    <Box width={8}/>
                    <Chip icon={<ThumbDownIcon/>} label={post.downvotes.length} clickable color="secondary" onClick={downvoteClick} variant={getDownvoteButtonVariant()} id={`forumPostAccordionDownvote${postIndex}`}/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                {post.comments.map((comment,index)=>(
                                    <div>
                                        <span><b>{comment.facultyName+" : "}</b></span>
                                        <span>{comment.commentText}</span>
                                        <Box height={4}/>
                                    </div>
                                ))}
                                <Box height={8}/>
                                <TextField variant="outlined" value={commentText} id={`forumPostAccordionCommentTextField${postIndex}`} onChange={onCommentTextChangeHandler} color="secondary" label="Your Comment" size="small"/>
                                <IconButton onClick={()=>postCommentHandler(postIndex)} id={`forumPostAccordionCommentSendButton${postIndex}`}>
                                    <SendIcon id="warningColor"/>
                                </IconButton>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}