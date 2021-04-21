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
import DateServices from "../services/DateServices";
import AttendanceServices from "../services/AttendanceServices";

export default function GatePassStudentAccordion({accordionID, passType, passJSON, handlePassAction, passRoute}){
    const departureTime=new Date(passJSON.passDetails.departureTime);
    const arrivalTime=new Date(passJSON.passDetails.arrivalTime);

    const getCGPA=()=>{
        let sum=0;
        for(let i=0; i<passJSON.personalDetails.sgpaList.length; i++){
            sum+=passJSON.personalDetails.sgpaList[i];
        }

        return (sum/passJSON.personalDetails.sgpaList.length).toFixed(2);
    }

    const getTimeStartName=()=>{
        if(passRoute==='odform'){
            return "Start Time";
        }
        return "Departure Time";
    }

    const getTimeEndName=()=>{
        if(passRoute==='odform'){
            return "End Time";
        }
        return "Arrival Time";
    }

    const getSGPAString=()=>{
        let sgpaString="";
        let i=0;
        for(const sgpa of passJSON.personalDetails.sgpaList){
            if(i!==passJSON.personalDetails.sgpaList.length-1){
                sgpaString+=sgpa+" , ";
            }else{
                sgpaString+=sgpa;
            }
            i++;
        }
        return sgpaString;
    }

    const approveGatePassHandler=(event)=>{
        event.stopPropagation();
        handlePassAction(passJSON.passDetails.passID,accordionID,passType,'approved');
    }
    const cancelGatePassHandler=(event)=>{
        event.stopPropagation();
        handlePassAction(passJSON.passDetails.passID,accordionID,passType,'cancelled');
    }
    const withholdGatePassHandler=(event)=>{
        event.stopPropagation();
        handlePassAction(passJSON.passDetails.passID,accordionID,passType,'withheld');
    }


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{passJSON.personalDetails.clgID}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">{passJSON.personalDetails.name}</Typography>
                    </Box>
                    <Box width={8}/>
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length===0 && <CheckIcon id='okColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>0 && studentJSON.personalDetails.studentID.disciplinaryActions.length<3 && <AlertIcon id='alertColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>=3 && <WarningIcon id='warningColor'/>}*/}
                    <Box width={12}/>
                        <IconButton size="small" onClick={approveGatePassHandler} disabled={passType==='approved'}>
                            <CheckIcon id={passType!=='approved' && 'okColor'}/>
                        </IconButton>
                        <IconButton size="small" onClick={cancelGatePassHandler} disabled={passType==='cancelled'}>
                            <CancelIcon id={passType!=='cancelled' && 'warningColor'}/>
                        </IconButton>
                    {passRoute==='gatepass' && <IconButton size="small" onClick={withholdGatePassHandler} disabled={passType === 'withheld'}>
                        <LockIcon id={passType !== 'withheld' && 'alertColor'}/>
                    </IconButton>}
                    <Box width={8}/>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Personal Details</b>
                                <Box height={10}/>
                                <div>
                                    <span>Blood Group</span>: {passJSON.personalDetails.bloodGroup}
                                </div>

                                <div>
                                    <span>Phone Number</span>: {passJSON.personalDetails.phoneNumber}
                                </div>

                                <div>
                                    <span>Residence Address</span>: {passJSON.personalDetails.address}
                                </div>

                                <div>
                                    <span>CGPA</span>:   {getCGPA()}
                                </div>

                                <div>
                                    <span>SGPA</span>:   {getSGPAString()}
                                </div>

                                <div>
                                    <span>Current Semester</span>:   {passJSON.personalDetails.curSem}
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
                                    <span>{getTimeStartName()}</span>: <b>{DateServices.getDateTimeAsString(departureTime)}</b>
                                </div>

                                <div>
                                    <span>{getTimeEndName()}</span>: <b>{DateServices.getDateTimeAsString(arrivalTime)}</b>
                                </div>
                                
                                
                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Attendance Summary</b>
                                <Box height={10}/>
                                {passJSON.attendanceDetails.map((item)=>(
                                    <div>
                                        <span>{item.courseName+" : "}</span>
                                        <span id={AttendanceServices.getAttendancePercentageTextStyle(AttendanceServices.getAttendancePercentage(item))}>{AttendanceServices.getAttendancePercentage(item)+" %"}</span>
                                    </div>
                                ))}
                                <Box height={8}/>
                                <Divider />
                                <Box height={8}/>
                                <b>Disciplinary Actions</b>
                                <Box height={10}/>
                                {passJSON.personalDetails.disciplinaryActions.map((item)=>(
                                    <div className='disciplinaryActionText'>{item}
                                        <Box height={4}/>
                                    </div>
                                ))}
                                {(typeof passJSON.personalDetails.disciplinaryActions.length==='undefined' || passJSON.personalDetails.disciplinaryActions.length===0) && <div className='noDisciplinaryActionText'>No disciplinary actions
                                </div>}

                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}