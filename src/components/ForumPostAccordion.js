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


export default function ForumPostAccordion(){
    const upvoteClick = () => {
        console.info('You Upvoted.');
    };
    
    const downvoteClick = () => {
        console.info('You Downvoted.');
    };

    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">Sri Devi</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={2}>
                        <Typography className="accordionText" id="accordionTextSecondary">Can we give next hour free Can we give next hour free Can we give next hour free Can we give next hour free</Typography>
                    </Box>
                    <Box width={8}/>
                    <Chip icon={<ThumbUpIcon/>} label="1" clickable color="primary" onClick={upvoteClick} variant="default"/>
                    <Box width={8}/>
                    <Chip icon={<ThumbDownIcon/>} label="1" clickable color="secondary" onClick={downvoteClick} variant="outlined"/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>VJK</b>:    Yes mam.  
                                <Box height={4}/>
                                <b>Rick Raaj</b>:    No mam, I need one more hour.   
                                <Box height={8}/>
                                <TextField variant="outlined" color="secondary" label="Your Comment" size="small"/>
                                <IconButton>
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