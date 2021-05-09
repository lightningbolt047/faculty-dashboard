import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import CircularProgress from "@material-ui/core/CircularProgress";

export default function FacultyAttendanceCard({fieldID,facultyAttendance}){

    if(typeof facultyAttendance==='undefined'){
        return (
            <CircularProgress size={24} color="secondary"/>
        );
    }

    let remainingCasualLeaves=facultyAttendance.totalLeaveDays.casualLeaves-facultyAttendance.facultyLeaveDays.casualLeaves;
    let remainingEarnedLeaves=facultyAttendance.totalLeaveDays.earnedLeaves-facultyAttendance.facultyLeaveDays.earnedLeaves;
    let remainingMedicalLeaves=facultyAttendance.totalLeaveDays.medicalLeaves-facultyAttendance.facultyLeaveDays.medicalLeaves;

    const getRemainingLeavePercentage=(leaveType)=>{
        if(leaveType==='casual'){
            return remainingCasualLeaves/facultyAttendance.totalLeaveDays.casualLeaves;
        }else if(leaveType==='earned'){
            return remainingEarnedLeaves/facultyAttendance.totalLeaveDays.earnedLeaves;
        }else if(leaveType==='medical'){
            return remainingMedicalLeaves/facultyAttendance.totalLeaveDays.medicalLeaves;
        }
    }

    const getLeaveWarning=(leaveType)=>{
        if(getRemainingLeavePercentage(leaveType)<0.2){
            return true;
        }else{
            return false;
        }
    }



    return (
        <Card className={fieldID} variant="outlined">
            <CardContent>
                <Box flex={1}/>
                <Typography  variant="h5" color={"secondary"} component="h2">
                    Your Leave Details
                </Typography>
                <Box height={10}/>
                <Typography variant={'h6'} id={'attendanceBigNumber'}>Total Remaining Leaves</Typography>
                <Typography variant="h2" id={'attendanceBigNumber'}>{remainingCasualLeaves+remainingEarnedLeaves+remainingMedicalLeaves}</Typography>
                <Box height={20}/>
                <Typography variant={'h6'} id={'okColor'}>You can avail</Typography>
                <Box flex={1} height={20}/>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <Typography variant={'caption'} id={getLeaveWarning('casual')?'warningColor':'casualColor'}><b>Casual Leaves</b></Typography>
                        <Typography variant="h2" id={getLeaveWarning('casual')?'warningColor':'casualColor'}>{remainingCasualLeaves}</Typography>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item>
                        <Typography variant={'caption'} id={getLeaveWarning('earned')?'warningColor':'earnedColor'}><b>Earned Leaves</b></Typography>
                        <Typography variant="h2" id={getLeaveWarning('earned')?'warningColor':'earnedColor'}>{remainingEarnedLeaves}</Typography>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item>
                        <Typography variant={'caption'} id={getLeaveWarning('medical')?'warningColor':'medicalColor'}><b>Medical Leaves</b></Typography>
                        <Typography variant="h2" id={getLeaveWarning('medical')?'warningColor':'medicalColor'}>{remainingMedicalLeaves}</Typography>
                    </Grid>
                </Grid>
                {/*<Typography variant="h3" color="secondary">{findRemainingBunkableDays()}</Typography>*/}
                {/*<Typography>More days leave</Typography>*/}
            </CardContent>
        </Card>
    );
}