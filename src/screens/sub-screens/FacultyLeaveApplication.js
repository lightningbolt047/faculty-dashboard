import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FacultyLeaveAccordion from '../../components/FacultyLeaveAccordion';
import {useEffect, useState} from "react";
import backendService from '../../services/backendService';
import EmojiTransportationIcon from '@material-ui/icons/EmojiTransportation';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import FacultyAttendanceCard from '../../components/FacultyAttendanceCard';
import DateServices from "../../services/DateServices";

let allPassDetails=[];
let fromDateISO,toDateISO;
export default function FacultyLeaveApplication(){
    const [leaveReason,setLeaveReason]=useState("");
    const [fromDate,setFromDate]=useState('');
    const [toDate,setToDate]=useState('');
    const [totalWorkingDays,setTotalWorkingDays]=useState(0);
    const [totalLeaveDays,setTotalLeaveDays]=useState(0);
    const [attendedDays,setAttendedDays]=useState(0);
    const [snackbarOpen,setSnackbarOpen]=useState(false);
    const [putStatusCode,setPutStatusCode]=useState(200);
    const [shownPassDetails,setShownPassDetails]=useState([]);

    const getAttendanceDetails=async ()=>{
        let responseBody=await backendService('GET','/profile/getAttendance/',{},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
        if(responseBody.statusCode===200){
            setTotalWorkingDays(responseBody.totalWorkingDays);
            setTotalLeaveDays(responseBody.totalLeaveDays);
            setAttendedDays(responseBody.attendedDays);
        }
    }

    const getFacultyPassDetails=async ()=>{
        let responseBody=await backendService('GET','/facultyLeave/',{},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
        if(responseBody.statusCode===200){
            allPassDetails=responseBody;
        }
    }

    const sendNewLeave=async ()=>{
        let responseBody=await backendService('PUT',/facultyLeave/,
            {
                reason:leaveReason,
                departureTime:fromDateISO,
                arrivalTime:toDateISO
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        setPutStatusCode(responseBody.statusCode);
        setSnackbarOpen(true);
        if(responseBody.statusCode===200){
            setLeaveReason('');
            setFromDate('');
            setToDate('');
            fromDateISO='';
            toDateISO='';
            fetchFromServer();
        }
    }

    const updateLeaveStatus=async (index,newLeaveStatus)=>{
        let responseBody=await backendService('POST','/facultyLeave/',
            {
                leaveID:shownPassDetails[index]._id,
                leaveStatus:newLeaveStatus
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID);
        return responseBody.statusCode;
    }

    const fetchFromServer=async ()=>{
        await getAttendanceDetails();
        await getFacultyPassDetails();
        sortPassByDateAndShow();
    }

    useEffect(()=>{
        fetchFromServer();
        //eslint-disable-next-line
    },[]);


    const sortPassByDateAndShow=()=>{
        allPassDetails.sort((a,b)=>{
            if(Date.parse(b.departureTime)===Date.parse(a.departureTime)){
                return Date.parse(b.arrivalTime)-Date.parse(a.arrivalTime);
            }
            return Date.parse(b.departureTime)-Date.parse(a.departureTime);
        });
        setShownPassDetails(allPassDetails);
    }

    const handleFacultyLeaveChange=async (index,newLeaveStatus)=>{
        if(await updateLeaveStatus(index,newLeaveStatus)){
            let tempLeaveList=[];
            for(const leave of shownPassDetails){
                tempLeaveList.push(leave);
            }
            tempLeaveList[index].leaveStatus=newLeaveStatus
            setShownPassDetails(tempLeaveList);
        }
    }

    const handleLeaveReasonChange=(e)=>{
        setLeaveReason(e.target.value);
    }
    const handleFromDateChange=(e)=>{
        setFromDate(e.target.value);
        fromDateISO=DateServices.dateToISO(e.target.value);
    }
    const handleToDateChange=(e)=>{
        setToDate(e.target.value);
        toDateISO=DateServices.dateToISO(e.target.value);
    }

    const handleSnackbarClose=(event,reason)=>{
        if (reason!=='clickaway'){
            setSnackbarOpen(false);
        }
    }
    const successDiv=()=>{
        return (
            <div>
                <Alert variant="filled" severity="success">
                    Added leave successfully
                </Alert>
            </div>
        );
    }

    const errDiv=()=>{
        return (
          <div>
              <Alert variant={'filled'} severity={'error'}>
                  Provide Valid Details
              </Alert>
          </div>
        );
    }

    const getAlertDiv=()=>{
        if(putStatusCode===200){
            return successDiv();
        }
        return errDiv();
    }




    return (
        <div>
            <Grid container spacing={3} alignContent="center" justify="center">
                <Grid item>
                    <FacultyAttendanceCard totalWorkingDays={totalWorkingDays} attendedDays={attendedDays} totalLeaveDays={totalLeaveDays}/>
                </Grid>

                <Grid item>
                    <Card className='attendanceCard' variant="outlined">
                        <CardContent>
                            <Typography  variant="h5" color={"secondary"} component="h2">
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
                            <Button variant='contained' color='secondary' onClick={sendNewLeave}>Apply</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {shownPassDetails.length!==0 && <div className={'gatePassSegmentRegular'}>
                <EmojiTransportationIcon fontSize={'large'}/>
                <Typography variant={'h4'} id={'gatePassSegmentText'}>Leave Details</Typography>
            </div>}
            {shownPassDetails.map((item,index)=>(
                <div>
                    <FacultyLeaveAccordion key={index} accordionID={index} passJSON={item} handleLeaveChange={handleFacultyLeaveChange} />
                </div>
            ))}

            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                {getAlertDiv()}
            </Snackbar>

            
            
        </div>
    );
}