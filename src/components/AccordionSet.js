import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import {useState} from 'react';

export default function AccordionSet(){
    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Students Name</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className='accText'>
                        CGPA: ____<br/>
                        DISP Action: YES/NO<br/>
                        Attendance - Subjectwise Attendance list<br/>
                        I Am A Text Box - Edit Me For Mentoring Diary<br/>
                    </Typography>
                    
                </AccordionDetails>
            </Accordion>

        </div>
    );
}