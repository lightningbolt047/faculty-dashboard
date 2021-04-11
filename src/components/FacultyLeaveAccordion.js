import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import LockIcon from '@material-ui/icons/Lock';
import IconButton from "@material-ui/core/IconButton";
import { CheckCircleOutlined } from '@material-ui/icons';

export default function FacultyLeaveAccordion(){
    
    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">Faculty ID</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">Faculty Name</Typography>
                    </Box>
                    <Box width={8}/>
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length===0 && <CheckIcon id='okColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>0 && studentJSON.personalDetails.studentID.disciplinaryActions.length<3 && <AlertIcon id='alertColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>=3 && <WarningIcon id='warningColor'/>}*/}
                    <Box width={12}/>
                        <IconButton size="small">
                            <CheckIcon/>
                        </IconButton>
                        <IconButton size="small">
                            <CancelIcon/>
                        </IconButton>
                        <IconButton size="small">
                        <LockIcon/>
                        </IconButton>
                    <Box width={8}/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Leave Details</b>
                                <Box height={10}/>
                                <div>
                                    <span>Leave Reason</span>: Wedding
                                </div>

                                <div>
                                    <span>From Date</span>: 12/04/2021
                                </div>

                                <div>
                                    <span>To Date</span>: 20/04/2021
                                </div>

                                <div>
                                    <span>Contact Details</span>:   8324324234
                                </div>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}