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
import IconButton from "@material-ui/core/IconButton";

export default function HodLeaveApproveAccordion({accordionID, passType, passJSON, handlePassAction}){
    const departureTime=new Date(passJSON.passDetails.departureTime);
    const arrivalTime=new Date(passJSON.passDetails.arrivalTime);

    const getAttendancePercentageTextStyle=(percentage)=>{
        if(percentage<75){
            return 'warningColor';
        }else if(percentage>=75 && percentage<=85){
            return 'alertColor';
        }
        else{
            return 'okColor';
        }
    }

    const getAttendancePercentage=()=>{
        try{
            return ((passJSON.attendanceDetails.attendedDays/(passJSON.attendanceDetails.attendedDays+passJSON.attendanceDetails.totalLeaveDays))*100).toFixed(2);
        }catch (e){
            return '0';
        }
    }

    const getDateAsString=(dateTime)=>{
        return `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
    }

    const cancelGatePassHandler=(event)=>{
        event.stopPropagation();
        handlePassAction(passJSON.passDetails.passID,accordionID,passType,'cancelled');
    }
    const approveGatePassHandler=(event)=>{
        event.stopPropagation();
        handlePassAction(passJSON.passDetails.passID,accordionID,passType,'approved');
    }


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary id={`hodLeaveApproveAccordion${passType+accordionID}`} expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{passJSON.personalDetails.clgID}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">{passJSON.personalDetails.name}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box width={12}/>
                    <IconButton size="small" onClick={approveGatePassHandler} disabled={passType==='approved'} id={`hodLeaveApproveAccordionApprove${passType+accordionID}`}>
                        <CheckIcon id={passType!=='approved' && 'okColor'}/>
                    </IconButton>
                    <IconButton size="small" onClick={cancelGatePassHandler} disabled={passType==='cancelled'} id={`hodLeaveApproveAccordionCancel${passType+accordionID}`}>
                        <CancelIcon id={passType!=='cancelled' && 'warningColor'}/>
                    </IconButton>
                    <Box width={8}/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Personal Details</b>
                                <Box height={10}/>
                                <div>
                                    <span>Phone Number</span>: {passJSON.personalDetails.phoneNumber}
                                </div>

                                <div>
                                    <span>Residence Address</span>: {passJSON.personalDetails.address}
                                </div>

                                <div>
                                    <span>Department</span>: {passJSON.personalDetails.department}
                                </div>

                                <Box height={8}/>
                                <Divider />
                                <Box height={8}/>
                                <b>Pass Details</b>
                                <Box height={10}/>

                                <div>
                                    <span>Reason</span>: <b>{passJSON.passDetails.reason}</b>
                                </div>

                                <div>
                                    <span>From</span>: <b>{getDateAsString(departureTime)}</b>
                                </div>

                                <div>
                                    <span>To</span>: <b>{getDateAsString(arrivalTime)}</b>
                                </div>


                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Attendance Summary</b>
                                <Box height={10}/>
                                    <div>
                                        <span>{"Total Working Days : "}</span>
                                        <span>{passJSON.attendanceDetails.totalWorkingDays}</span>
                                    </div>
                                <Box height={8}/>
                                <div>
                                    <span>{"Leaves Taken : "}</span>
                                    <span>{passJSON.attendanceDetails.totalLeaveDays}</span>
                                </div>
                                <Box height={8}/>
                                <div>
                                    <span>{"Days Present : "}</span>
                                    <span>{passJSON.attendanceDetails.attendedDays}</span>
                                </div>
                                <Box height={8}/>
                                <div>
                                    <span>{"Attendance % : "}</span>
                                    <span id={getAttendancePercentageTextStyle(getAttendancePercentage())}>{getAttendancePercentage()}</span>
                                </div>
                                <Box height={8}/>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}