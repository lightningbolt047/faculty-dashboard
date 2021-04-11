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
import {useEffect, useState} from "react";
import backendService from '../../services/backendService';


export default function FacultyLeaveApplication(){
    const [leaveReason,setLeaveReason]=useState("");
    const [fromDate,setFromDate]=useState('');
    const [toDate,setToDate]=useState('');
    const [totalWorkingDays,setTotalWorkingDays]=useState(0);
    const [totalLeaveDays,setTotalLeaveDays]=useState(0);
    const [attendedDays,setAttendedDays]=useState(0);
    let fromDateISO,toDateISO;

    const getAttendanceDetails=async ()=>{
        let responseBody=await backendService('GET','/profile/getAttendance/',{},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
        if(responseBody.statusCode===200){
            setTotalWorkingDays(responseBody.totalWorkingDays);
            setTotalLeaveDays(responseBody.totalLeaveDays);
            setAttendedDays(responseBody.attendedDays);
        }
        console.log(responseBody);
    }

    useEffect(()=>{
        getAttendanceDetails();
    },[]);

    const handleLeaveReasonChange=(e)=>{
        setLeaveReason(e.target.value);
    }
    const handleFromDateChange=(e)=>{
        setFromDate(e.target.value);
        fromDateISO=dateToISO(e.target.value);
    }
    const handleToDateChange=(e)=>{
        setToDate(e.target.value);
        toDateISO=dateToISO(e.target.value);
    }

    const dateToISO=(inputDate)=>{
        if(inputDate!=='' && typeof inputDate!=='undefined'){
            return new Date(inputDate).toISOString();
        }
    }
    const getAttendancePercentageString=()=>{
        return ((attendedDays/(attendedDays+totalLeaveDays))*100).toFixed(2)+" %";
    }
    const findRemainingBunkableDays=()=>{
        let crossedWorkingDays=attendedDays+totalLeaveDays;
        let allowedLeaveCount=0;
        while((attendedDays/crossedWorkingDays)>0.75){
            allowedLeaveCount++;
            crossedWorkingDays++;
        }
        if(crossedWorkingDays!==(attendedDays+totalLeaveDays)){
            allowedLeaveCount--;
        }
        return allowedLeaveCount;
    }




    return (
        <div>
            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <Card className='attendanceCard' variant="outlined">
                        <CardContent>
                            <Box flex={1}/>
                            <Typography  variant="h5" component="h2">
                            Faculty Attendance Details
                            </Typography>
                            <Box height={10}/>
                            <Typography color="textSecondary" gutterBottom>
                                Total Working Days: {totalWorkingDays}<br/>
                                Total Working Days Crossed: {totalLeaveDays+attendedDays}<br/>
                                Total Days Attended: {attendedDays}<br/>
                                Total Leaves Taken: {totalLeaveDays}<br/>
                                Faculty Attendance Percentage: {getAttendancePercentageString()}<br/>
                                You can take <b>{findRemainingBunkableDays()}</b> more days leaves.<br/>
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
                            <TextField variant="outlined" color="secondary" label="Reason" value={leaveReason} onChange={handleLeaveReasonChange} fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" InputLabelProps={{ shrink: true }} type="date" label="From Date" value={fromDate} onChange={handleFromDateChange} fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" InputLabelProps={{ shrink: true }} type="date" label="To Date" value={toDate} onChange={handleToDateChange} fullWidth/>
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