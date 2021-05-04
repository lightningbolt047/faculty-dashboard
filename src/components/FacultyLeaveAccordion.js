import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CheckIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FacultyLeaveServices from '../services/FacultyLeaveServices';

export default function FacultyLeaveAccordion({accordionID,passJSON,handleLeaveChange}){

    const getDateFormatFromISODate=(dateISO)=>{
        const dateObject=new Date(dateISO);
        return dateObject.getDate()+"/"+(dateObject.getMonth()+1)+"/"+(dateObject.getFullYear());
    }

    const approveLeaveHandler=(event)=>{
        event.stopPropagation();
        handleLeaveChange(accordionID,'pending');
    }
    const cancelLeaveHandler=(event)=>{
        event.stopPropagation();
        handleLeaveChange(accordionID,'facultyCancelled');
    }
    
    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary  id={`facultyLeaveAccordion${passJSON.leaveStatus+accordionID}`} expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="facultyLeaveAccordionTextPrimary">From: <b>{getDateFormatFromISODate(passJSON.departureTime)}</b></Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">To: <b>{getDateFormatFromISODate(passJSON.arrivalTime)}</b></Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        {passJSON.leaveStatus==='approved' && <Button variant={'outlined'} size={'small'} id={'okColor'}>
                            Approved By HOD
                        </Button>}
                        {passJSON.leaveStatus==='pending' && <Button variant={'outlined'} size={'small'} id={'alertColor'}>
                            Pending for Approval
                        </Button>}
                        {passJSON.leaveStatus==='cancelled' && <Button variant={'outlined'} size={'small'} id={'warningColor'}>
                            Cancelled By HOD
                        </Button>}
                        {passJSON.leaveStatus==='facultyCancelled' && <Button variant={'outlined'} size={'small'} id={'warningColor'}>
                            Withdrawn
                        </Button>}
                    </Box>
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length===0 && <CheckIcon id='okColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>0 && studentJSON.personalDetails.studentID.disciplinaryActions.length<3 && <AlertIcon id='alertColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>=3 && <WarningIcon id='warningColor'/>}*/}
                    <Box width={12}/>
                        <IconButton size="small" disabled={passJSON.leaveStatus==='approved' || passJSON.leaveStatus==='pending' || passJSON.leaveStatus==='cancelled'} onClick={approveLeaveHandler} id={`facultyLeaveAccordionPending${passJSON.leaveStatus+accordionID}`}>
                            <CheckIcon id={passJSON.leaveStatus!=='approved' && passJSON.leaveStatus!=='pending' && passJSON.leaveStatus!=='cancelled' && 'okColor'}/>
                        </IconButton>
                        <IconButton size="small" disabled={passJSON.leaveStatus==='cancelled' || passJSON.leaveStatus==='facultyCancelled'} onClick={cancelLeaveHandler} id={`facultyLeaveAccordionWithdraw${passJSON.leaveStatus+accordionID}`}>
                            <CancelIcon id={(passJSON.leaveStatus!=='cancelled' && passJSON.leaveStatus!=='facultyCancelled') && 'warningColor'}/>
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
                                    <span>Leave Reason</span>: <b>{passJSON.reason}</b><br/>
                                    <span>Leave Type</span>: <b>{FacultyLeaveServices.getFacultyLeaveTypeStringFromCode(passJSON.leaveType)}</b><br/>
                                    <span>Leave Timing</span>: <b>{FacultyLeaveServices.getFacultyLeaveTimingStringFromCode(passJSON.leaveTiming)}</b>
                                </div>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}