import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
// import Snackbar from '@material-ui/core/Snackbar';
// import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import backendService from "../../services/backendService";
import HodLeaveStatusCard from '../../components/HodLeaveStatusCard';
import FacultyAttendanceCard from "../../components/FacultyAttendanceCard";

function createTimeTable(weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7) {
    return { weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7 };
}

function createCourseInfo(courseName, courseCode, sections) {
    return { courseName, courseCode, sections };
}

let isHOD=false;

export default function HomeScreen(){

    const [timetableRows,setTimetableRows]=useState([]);
    const [courseRows,setCourseRows]=useState([]);
    const [totalLeaveDays,setTotalLeaveDays]=useState(0);
    const [attendedDays,setAttendedDays]=useState(0);
    const [pendingLeaveApprovals,setPendingLeaveApprovals]=useState(-1);
    const [pendingLeaveApprovalsLoading,setPendingLeaveApprovalsLoading]=useState(true);
    const [facultyAttendanceDetails,setFacultyAttendanceDetails]=useState();
    // const [isHOD,setIsHOD]=useState(false);

    const getTimetableFromServer=async ()=>{
        let responseBody=await backendService('GET','/timetable',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
            );
        if(responseBody.statusCode===200){
            setTimetableInTable(responseBody)
        }
    }

    const getNumPendingLeaveApprovals=async ()=>{
        setPendingLeaveApprovalsLoading(true);
        let responseBody=await backendService('GET','/hodLeaveApprove/getNumLeaves',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setPendingLeaveApprovals(responseBody.numLeaves);
            setPendingLeaveApprovalsLoading(false);
        }
    }

    const getEnrolledCoursesFromServer=async ()=>{
        let responseBody=await backendService('GET','/courseNotes',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setEnrolledCoursesInTable(responseBody);
        }
    }

    const getAttendanceDetails=async ()=>{
        let responseBody=await backendService('GET','/profile/getAttendance/',{},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
        if(responseBody.statusCode===200){
            setFacultyAttendanceDetails(responseBody);
        }
    }

    const separateSectionListWithComma=(sectionList)=>{
        let sectionString="";
        for(let i=0;i<sectionList.length;i++){
            sectionString+=sectionList[i];
            if(i!==sectionList.length-1){
                sectionString+=' , '
            }
        }
        return sectionString;
    }

    const setEnrolledCoursesInTable=(receivedCourses)=>{
        let courseRowsTemp=[];
        for(const course of receivedCourses){
            courseRowsTemp.push(createCourseInfo(course.courseName,course.courseCode,separateSectionListWithComma(course.sections)));
        }
        setCourseRows(courseRowsTemp);
    }

    const setTimetableInTable=(receivedTimetable)=>{
        let timeTableClass=[];
        let timeTableCourseCodes=[];
        let timeTableRowsTemp=[];
        for(let i=0;i<7;i++){
            timeTableClass.push([]);
            timeTableCourseCodes.push([]);
            for(let j=0;j<7;j++){
                timeTableClass[i].push(" ");
                timeTableCourseCodes[i].push(" ");
            }
        }
        let dayIndex=0;
        for(const day of receivedTimetable){
            for(const hour of day){
                timeTableClass[dayIndex][hour.hour]=hour.section;
                timeTableCourseCodes[dayIndex][hour.hour]=hour.courseCode;
            }
            dayIndex++;
        }
        let daysOfWeek=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        for(let i=0;i<daysOfWeek.length;i++){
            timeTableRowsTemp.push(createTimeTable(daysOfWeek[i], timeTableCourseCodes[i][0], timeTableCourseCodes[i][1], timeTableCourseCodes[i][2], timeTableCourseCodes[i][3],timeTableCourseCodes[i][4],timeTableCourseCodes[i][5],timeTableCourseCodes[i][6]));
        }
        setTimetableRows(timeTableRowsTemp);
    }


    useEffect(()=>{
        if(sessionStorage.HOD==='true'){
            isHOD=true;
        }else{
            isHOD=false;
        }
       getTimetableFromServer();
       getEnrolledCoursesFromServer();
       if(!isHOD){
           getAttendanceDetails();
       }else{
           getNumPendingLeaveApprovals();
       }
       // eslint-disable-next-line
    },[]);

    
    return (
        <div>
            <Grid container spacing={3} direction={'row'} alignContent="center" justify="center">
                <Grid item>
                    <Card className='homeRowcard' variant="outlined">
                        <CardContent>
                            <Box flex={1}/>
                            <Typography  variant="h5" color={"secondary"} component="h2">
                                Your Enrolled Courses
                            </Typography>
                            <Box height={8}/>
                            <TableContainer component={Paper}>
                                <Table className='timetable' size="small">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Course Name</TableCell>
                                        <TableCell align="center">Course Code</TableCell>
                                        <TableCell align="center">Handling Sections</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {courseRows.map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" align="center" scope="row">
                                            {row.courseName}
                                        </TableCell>
                                        <TableCell align="center">{row.courseCode}</TableCell>
                                        <TableCell align="center">{row.sections}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box height={10}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    {!isHOD && <FacultyAttendanceCard fieldID="homeRowcard" facultyAttendance={facultyAttendanceDetails}/>}
                    {isHOD && <HodLeaveStatusCard isLoading={pendingLeaveApprovalsLoading} numLeavesPending={pendingLeaveApprovals}/>}
                </Grid>
            </Grid>

            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <Card className='homeCard' variant="outlined">
                        <CardContent>
                            <Box flex={1}/>
                            <Typography  variant="h5" color={"secondary"} component="h2">
                            Your Timetable
                            </Typography>
                            <Box height={8}/>
                            <TableContainer component={Paper}>
                                <Table className='timetable' size="small">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Weekday</TableCell>
                                        <TableCell align="center">8:50 to 9:40</TableCell>
                                        <TableCell align="center">9:50 to 10:40</TableCell>
                                        <TableCell align="center">11:00 to 11:50</TableCell>
                                        <TableCell align="center">12:00 to 12:50</TableCell>
                                        <TableCell align="center">2:00 to 3:00</TableCell>
                                        <TableCell align="center">3:00 to 4:00</TableCell>
                                        <TableCell align="center">4:00 to 5:00</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {timetableRows.map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.weekDay}
                                        </TableCell>
                                        <TableCell  align="center">{row.hr1}</TableCell>
                                        <TableCell  align="center">{row.hr2}</TableCell>
                                        <TableCell  align="center">{row.hr3}</TableCell>
                                        <TableCell  align="center">{row.hr4}</TableCell>
                                        <TableCell  align="center">{row.hr5}</TableCell>
                                        <TableCell  align="center">{row.hr6}</TableCell>
                                        <TableCell  align="center">{row.hr7}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box height={10}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
                
            

            
            
        </div>
    );
}