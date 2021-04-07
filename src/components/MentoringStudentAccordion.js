import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import EditableTextArea from './EditableTextArea';
import CheckIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import AlertIcon from '@material-ui/icons/Error';

export default function MentoringStudentAccordion({accordionID, studentJSON, mentorDairyText, handleMentorTextChange,handleMentorTextSubmit}){

    const getCGPA=()=>{
        let sum=0;
        for(let sgpaIter of studentJSON.personalDetails.studentID.sgpaList){
            sum+=sgpaIter;
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


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary id={`mentoringAccordion${accordionID}`} expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{studentJSON.personalDetails.studentID.clgID}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">{studentJSON.personalDetails.studentID.name}</Typography>
                    </Box>
                    {studentJSON.personalDetails.studentID.disciplinaryActions.length===0 && <CheckIcon id='okColor'/>}
                        {studentJSON.personalDetails.studentID.disciplinaryActions.length>0 && studentJSON.personalDetails.studentID.disciplinaryActions.length<3 && <AlertIcon id='alertColor'/>}
                        {studentJSON.personalDetails.studentID.disciplinaryActions.length>=3 && <WarningIcon id='warningColor'/>}
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
                                <EditableTextArea key={accordionID} studentID={studentJSON.personalDetails.studentID._id} textAreaHelpText={"Enter student mentoring notes"} accordionID={accordionID} mentorDiaryText={mentorDairyText} handleTextChange={handleMentorTextChange} handleSubmit={handleMentorTextSubmit} advisorAllocationID={studentJSON.advisorAllocationID}/>
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

                                        // <div>{item.courseName+" : "+((item.studentAttendance/item.classesTaken)*100).toFixed(2)+" %"}
                                        //     <Box height={4}/>
                                        // </div>
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