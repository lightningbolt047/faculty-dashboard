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

export default function AccordionSet({key, studentJSON, mentorDairyText, handleMentorTextChange}){

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


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextPrimary">{studentJSON.personalDetails.studentID.clgID}</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">{studentJSON.personalDetails.studentID.name}</Typography>
                    </Box>
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
                                <b>Disciplinary Actions</b>:   {studentJSON.personalDetails.studentID.disciplinaryActions}
                                <Box height={4}/>
                                <b>Department</b>: {studentJSON.personalDetails.studentID.department}
                                <Box height={8}/>
                                <EditableTextArea key={key} mentorDiaryText={mentorDairyText} handleTextChange={handleMentorTextChange}/>
                            </div>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Attendance Summary</b>
                                <Box height={10}/>
                                    {studentJSON.attendanceDetails.map((item,index)=>(
                                        <div>{item.courseName+" : "+((item.studentAttendance/item.classesTaken)*100).toFixed(2)+" %"}
                                            <Box height={4}/>
                                        </div>
                                    ))}
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>

        </div>
    );
}