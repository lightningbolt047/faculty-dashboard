import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {useState} from 'react';

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
                            <div className='accordionDetailsLeft'>
                                Hello
                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDetailsLeft'>
                                Hello
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}