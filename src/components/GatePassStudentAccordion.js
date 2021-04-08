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

export default function GatePassStudentAccordion({accordionID, studentJSON}){

    const getCGPA=()=>{
        let sum=0;
        for(let i=0;i<studentJSON.personalDetails.studentID.sgpaList.length;i++){
            sum+=studentJSON.personalDetails.studentID.sgpaList[i];
        }

        return (sum/studentJSON.personalDetails.studentID.sgpaList.length).toFixed(2);
    }

    const getSGPAString=()=>{
        let sgpaString="";
        let i=0;
        for(const sgpa of studentJSON.personalDetails.studentID.sgpaList){
            if(i!==studentJSON.personalDetails.studentID.sgpaList.length-1){
                sgpaString+=sgpa+" , ";
            }else{
                sgpaString+=sgpa;
            }
            i++;
        }
        return sgpaString;
    }

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

    const approveGatePassHandler=(event)=>{
        event.stopPropagation();
        //Routine
    }
    const cancelGatePassHandler=(event)=>{
        event.stopPropagation();
        //Routine
    }
    const withholdGatePassHandler=(event)=>{
        event.stopPropagation();
        //Routine
    }


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{studentJSON.personalDetails.studentID.clgID}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">{studentJSON.personalDetails.studentID.name}</Typography>
                    </Box>
                    <Box width={8}/>
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length===0 && <CheckIcon id='okColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>0 && studentJSON.personalDetails.studentID.disciplinaryActions.length<3 && <AlertIcon id='alertColor'/>}*/}
                    {/*{studentJSON.personalDetails.studentID.disciplinaryActions.length>=3 && <WarningIcon id='warningColor'/>}*/}
                    <Box width={12}/>
                        <IconButton size="small" onClick={approveGatePassHandler}>
                            <CheckIcon id={'okColor'}/>
                        </IconButton>
                        <IconButton size="small" onClick={cancelGatePassHandler}>
                            <CancelIcon id={'warningColor'}/>
                        </IconButton>
                        <IconButton size="small" onClick={withholdGatePassHandler}>
                            <LockIcon id={'alertColor'}/>
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
                                    <span>Blood Group</span>: A+ve
                                </div>

                                <div>
                                    <span>Phone Number</span>: 9012384021
                                </div>

                                <div>
                                    <span>Residence Address</span>: 5, Wall street, USA
                                </div>

                                <div>
                                    <span>CGPA</span>:   {getCGPA()}
                                </div>

                                <div>
                                    <span>SGPA</span>:   {getSGPAString()}
                                </div>

                                <div>
                                    <span>Current Semester</span>:   {studentJSON.personalDetails.studentID.curSem}
                                </div>   

                                <div>
                                    <span>Department</span>: {studentJSON.personalDetails.studentID.department}
                                </div>

                                <Box height={8}/>
                                <Divider />
                                <Box height={8}/>
                                <b>Pass Details</b>
                                <Box height={10}/>

                                <div>
                                    <span>Reason</span>: <b>Going Home</b>
                                </div>

                                <div>
                                    <span>Departure Date Time</span>: <b>16/10/2021 6:30 PM</b>
                                </div>

                                <div>
                                    <span>Arrival Date Time</span>: <b>21/10/2021 6:00 AM</b>
                                </div>
                                
                                
                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Attendance Summary</b>
                                <Box height={10}/>
                                {studentJSON.attendanceDetails.map((item)=>(
                                    <div>
                                        <span>{item.courseName+" : "}</span>
                                        <span id={getAttendancePercentageTextStyle(((item.studentAttendance/item.classesTaken)*100).toFixed(2))}>{((item.studentAttendance/item.classesTaken)*100).toFixed(2)+" %"}</span>
                                    </div>
                                ))}
                                <Box height={8}/>
                                <Divider />
                                <Box height={8}/>
                                <b>Disciplinary Actions</b>
                                <Box height={10}/>
                                {studentJSON.personalDetails.studentID.disciplinaryActions.map((item)=>(
                                    <div className='disciplinaryActionText'>{item}
                                        <Box height={4}/>
                                    </div>
                                ))}
                                {(typeof studentJSON.personalDetails.studentID.disciplinaryActions.length==='undefined' || studentJSON.personalDetails.studentID.disciplinaryActions.length===0) && <div className='noDisciplinaryActionText'>No disciplinary actions
                                </div>}

                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}