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

export default function MentoringStudentAccordion({accordionID, studentJSON}){

    const getCGPA=()=>{
        let sum=0;
        for(let i=0;i<studentJSON.personalDetails.studentID.sgpaList.length;i++){
            sum+=studentJSON.personalDetails.studentID.sgpaList[i];
        }

        return (sum/studentJSON.personalDetails.studentID.sgpaList.length).toFixed(2);
    }

    const getSGPAString=()=>{
        let sgpaString="";
        for(let i=0;i<studentJSON.personalDetails.studentID.sgpaList.length;i++){
            if(i!==studentJSON.personalDetails.studentID.sgpaList.length-1){
                sgpaString+=studentJSON.personalDetails.studentID.sgpaList[i]+" , ";
            }else{
                sgpaString+=studentJSON.personalDetails.studentID.sgpaList[i];
            }
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
                    <Box flex={2}>
                        <Typography className="accordionText" id="accordionTextSecondary">{studentJSON.personalDetails.studentID.name}</Typography>
                    </Box>
                    <Box width={8}/>
                    <Box flex={5} component={'div'}>
                        <Typography className="accordionText" id="accordionTextSecondary">Reason: Want to go home, eat, sleep, more text here</Typography>
                    </Box>
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
                                <b>CGPA</b>:   {getCGPA()}
                                <Box height={4}/>
                                <b>SGPA</b>:   {getSGPAString()}
                                <Box height={4}/>
                                <b>Current Semester</b>:   {studentJSON.personalDetails.studentID.curSem}
                                <Box height={4}/>
                                <b>Department</b>: {studentJSON.personalDetails.studentID.department}
                                <Box height={8}/>
                                <Divider />
                                <Box height={8}/>
                                <b>Personal Details</b>
                                <Box height={10}/>
                                <b>Blood Group</b>: A+ve
                                <Box height={4}/>
                                <b>Phone Number</b>: 9012384021
                                <Box height={4}/>
                                <b>Residence Address</b>: 9ddw, dwndwi, ei3uh2uh2ude23, 2ju2823e823hre23, dwud2387hrd23udn23

                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Attendance Summary</b>
                                <Box height={10}/>
                                {studentJSON.attendanceDetails.map((item,index)=>(
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
                                {studentJSON.personalDetails.studentID.disciplinaryActions.map((item,index)=>(
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