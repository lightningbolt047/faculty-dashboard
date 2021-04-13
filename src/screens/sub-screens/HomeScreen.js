import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import {useState,useEffect} from 'react';
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

function createTimeTable(weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7) {
    return { weekDay, hr1, hr2, hr3, hr4, hr5, hr6, hr7 };
}
  
const timetableRows = [
createTimeTable('Monday', 'POML', 'Free', 'CN', 'CD','CD Lab','CD Lab','SE'),
createTimeTable('Tuesday', 'CD', 'CN', 'Free', 'SE','SE Lab','SE Lab','POML'),
createTimeTable('Wednesday', 'Elective', 'SE', 'CN', 'CD','EVS','EVS','CD'),
createTimeTable('Thursday', 'EVS', 'CD', 'Free', 'SE','POML Lab','POML Lab','CN'),
createTimeTable('Friday', 'Elective', 'POML', 'SE', 'Free','CN Lab','CN Lab','Elective'),
];

function createCourseInfo(courseName, courseCode, courseCredits, courseType) {
    return { courseName, courseCode, courseCredits, courseType };
}
  
const courseRows = [
    createCourseInfo('Compiler Design', '15CSE311', 4, 'Core'),
    createCourseInfo('Compiler Design Lab', '15CSE385', 1, 'Core'),
    createCourseInfo('Principles of Machine Learning', '15CSE432', 2, 'Elective'),
    createCourseInfo('Computer Networks', '15CSE312', 3, 'Core'),
    createCourseInfo('Software Engineering', '15CSE313', 3, 'Core'),
];


export default function FacultyLeaveApplication(){
    
    return (
        <div>
            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <Card className='homeCard' variant="outlined">
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
                                        <TableCell align="right">Course Name</TableCell>
                                        <TableCell align="right">Course Code</TableCell>
                                        <TableCell align="right">Course Credits</TableCell>
                                        <TableCell align="right">Course Type</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {courseRows.map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.courseName}
                                        </TableCell>
                                        <TableCell align="right">{row.courseCode}</TableCell>
                                        <TableCell align="right">{row.courseCredits}</TableCell>
                                        <TableCell align="right">{row.courseType}</TableCell>
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