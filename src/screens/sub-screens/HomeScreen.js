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
// import FacultyAttendanceCard from "../../components/FacultyAttendanceCard";

function createTimeTable(weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7) {
    return { weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7 };
}

function createCourseInfo(courseName, courseCode, courseCredits, courseType) {
    return { courseName, courseCode, courseCredits, courseType };
}

export default function HomeScreen(){

    const [timetableRows,setTimetableRows]=useState([]);
    const [courseRows,setCourseRows]=useState([]);
    // const [totalWorkingDays,setTotalWorkingDays]=useState(0);
    // const [totalLeaveDays,setTotalLeaveDays]=useState(0);
    // const [attendedDays,setAttendedDays]=useState(0);

    const getTimetableFromServer=async ()=>{
        let responseBody=await backendService('GET','/timetable',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
            );
        if(responseBody.statusCode===200){
            setTimetableInTable(responseBody)
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

    // const getAttendanceDetails=async ()=>{
    //     let responseBody=await backendService('GET','/profile/getAttendance/',{},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
    //     if(responseBody.statusCode===200){
    //         setTotalWorkingDays(responseBody.totalWorkingDays);
    //         setTotalLeaveDays(responseBody.totalLeaveDays);
    //         setAttendedDays(responseBody.attendedDays);
    //     }
    // }

    const setEnrolledCoursesInTable=(receivedCourses)=>{
        let courseRowsTemp=[];
        for(const course of receivedCourses){
            courseRowsTemp.push(createCourseInfo(course.courseName,course.courseCode,course.courseCredits,course.courseType));
        }
        setCourseRows(courseRowsTemp);
    }

    const setTimetableInTable=(receivedTimetable)=>{
        let timeTable=[];
        let timeTableRowsTemp=[];
        for(let i=0;i<7;i++){
            timeTable.push([]);
            for(let j=0;j<7;j++){
                timeTable[i].push("Free");
            }
        }
        let dayIndex=0;
        for(const day of receivedTimetable){
            for(const hour of day){
                timeTable[dayIndex][hour.hour]=hour.courseName;
            }
            dayIndex++;
        }
        let daysOfWeek=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        for(let i=0;i<daysOfWeek.length;i++){
            timeTableRowsTemp.push(createTimeTable(daysOfWeek[i], timeTable[i][0], timeTable[i][1], timeTable[i][2], timeTable[i][3],timeTable[i][4],timeTable[i][5],timeTable[i][6]));
        }
        setTimetableRows(timeTableRowsTemp);
    }


    useEffect(()=>{
       getTimetableFromServer();
       getEnrolledCoursesFromServer();
       // getAttendanceDetails();
       // eslint-disable-next-line
    },[]);

    
    return (
        <div>
            <Grid container spacing={3} direction={'row'} alignContent="center" justify="center">
                <Grid item>
                    <Card className='homeEnrolledCoursesCard' variant="outlined">
                        <CardContent>
                            <Box flex={1}/>
                            <Typography  variant="h5" component="h2">
                            Your Enrolled Courses
                            </Typography>
                            <Box height={8}/>
                            <TableContainer component={Paper}>
                                <Table className='timetable' size="small">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Course Name</TableCell>
                                        <TableCell align="center">Course Code</TableCell>
                                        <TableCell align="center">Course Credits</TableCell>
                                        <TableCell align="center">Course Type</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {courseRows.map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" align="center" scope="row">
                                            {row.courseName}
                                        </TableCell>
                                        <TableCell align="center">{row.courseCode}</TableCell>
                                        <TableCell align="center">{row.courseCredits}</TableCell>
                                        <TableCell align="center">{row.courseType}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box height={10}/>
                        </CardContent>
                    </Card>
                </Grid>
                {/*<Grid item>*/}
                {/*    <FacultyAttendanceCard totalWorkingDays={totalWorkingDays} attendedDays={attendedDays} totalLeaveDays={totalLeaveDays}/>*/}
                {/*</Grid>*/}
            </Grid>

            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <Card className='homeCard' variant="outlined">
                        <CardContent>
                            <Box flex={1}/>
                            <Typography  variant="h5" component="h2">
                            Your Timetable
                            </Typography>
                            <Box height={8}/>
                            <TableContainer component={Paper}>
                                <Table className='timetable' size="small">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Weekday</TableCell>
                                        <TableCell align="right">8:50 to 9:40</TableCell>
                                        <TableCell align="right">9:50 to 10:40</TableCell>
                                        <TableCell align="right">11:00 to 11:50</TableCell>
                                        <TableCell align="right">12:00 to 12:50</TableCell>
                                        <TableCell align="right">2:00 to 3:00</TableCell>
                                        <TableCell align="right">3:00 to 4:00</TableCell>
                                        <TableCell align="right">4:00 to 5:00</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {timetableRows.map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.weekDay}
                                        </TableCell>
                                        <TableCell align="right">{row.hr1}</TableCell>
                                        <TableCell align="right">{row.hr2}</TableCell>
                                        <TableCell align="right">{row.hr3}</TableCell>
                                        <TableCell align="right">{row.hr4}</TableCell>
                                        <TableCell align="right">{row.hr5}</TableCell>
                                        <TableCell align="right">{row.hr6}</TableCell>
                                        <TableCell align="right">{row.hr7}</TableCell>
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