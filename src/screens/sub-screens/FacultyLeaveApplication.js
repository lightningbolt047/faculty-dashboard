import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import {useState,useEffect} from 'react';
// import Snackbar from '@material-ui/core/Snackbar';
// import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FacultyLeaveAccordion from '../../components/FacultyLeaveAccordion';


let studentsDetails = [];

export default function FacultyLeaveApplication(){
    return (
        <div>
            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <Card className='attendanceCard' variant="outlined">
                        <CardContent>
                            <Typography  variant="h5" component="h2">
                            Faculty Attendance Details
                            </Typography>
                            <Box height={10}/>
                            <Typography color="textSecondary" gutterBottom>
                                Total Working Days: 93<br/>
                                Total Working Days Crossed: 31<br/>
                                Total Days Attended: 27<br/>
                                Total Leaves Taken: 4<br/>
                                Faculty Attendance Percentage: 83%<br/>
                                You can take 4 more days leaves.<br/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item>
                    <Card className='attendanceCard' variant="outlined">
                        <CardContent>
                            <Typography  variant="h5" component="h2">
                            Apply Leave
                            </Typography>
                            <Box height={10}/>
                            <Grid container alignContent="center" justify="center">
                            <TextField variant="outlined" color="secondary" label="Reason" fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" type="datetime-local" label="From Date" fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" type="datetime-local" label="To Date" fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Button variant='contained' color='secondary'>Apply</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <FacultyLeaveAccordion/>
            <FacultyLeaveAccordion/>
            <FacultyLeaveAccordion/>
            

            
            
        </div>
    );
}