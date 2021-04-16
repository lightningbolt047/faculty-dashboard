import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';


export default function CourseNotesAccordion({note}){

    const noteDate=new Date(note.date);
    const dateString=noteDate.getDate()+"/"+(noteDate.getMonth()+1)+"/"+noteDate.getFullYear();


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">Date: {dateString}</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Note</b>: {note.notes}
                                <Box height={4}/>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}