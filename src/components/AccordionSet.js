import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {useState} from 'react';
import EditableTextArea from '../components/EditableTextArea';

export default function AccordionSet(){
    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">CB.EN.U4CSE18318</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">Eswar</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container alignItems='center'>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                CGPA:   9.63<br/>
                                Current Semester:   VI<br/>
                                Year:   III<br/>
                                Class Advisor:  Vidhya S<br/>
                                <Box height={8}/>
                                <EditableTextArea/>
                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                Attendance Summary:<br/>
                                    Software Engineering:   100%<br/>
                                    Computer Networks:   100%<br/>
                                    Compiler Design:   100%<br/>
                                    Soft Skills:  100%<br/>
                                    Verbal:   100%<br/>
                                    Aptitude:   100%<br/>
                                    Computational Intelligence:   100%<br/>
                                    Principles Of Machine Learnng:  100%<br/>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}