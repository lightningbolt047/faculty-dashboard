import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import AttendanceServices from "../services/AttendanceServices";


export default function FacultyAttendanceCard({totalWorkingDays,attendedDays,totalLeaveDays}){


    const getAttendancePercentageString=()=>{
        return ((attendedDays/(attendedDays+totalLeaveDays))*100).toFixed(2)+"%";
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
        <Card className='attendanceCard' variant="outlined">
            <CardContent>
                <Box flex={1}/>
                <Typography  variant="h5" color={"secondary"} component="h2">
                    Faculty Attendance Details
                </Typography>
                <Box height={10}/>
                {/* <Typography color="textSecondary" gutterBottom>
                    Total Working Days: {totalWorkingDays}<br/>
                    Total Working Days Crossed: {totalLeaveDays+attendedDays}<br/>
                    Total Days Attended: {attendedDays}<br/>
                    Total Leaves Taken: {totalLeaveDays}<br/>
                    Faculty Attendance Percentage: {getAttendancePercentageString()}<br/>
                    You can take <b>{findRemainingBunkableDays()}</b> more days leaves.<br/>
                </Typography> */}
                <Typography>Your Attendance Percentage Is</Typography>
                <Typography variant="h2" id={AttendanceServices.getAttendancePercentageTextStyle(((attendedDays/(attendedDays+totalLeaveDays))*100))}>{getAttendancePercentageString()}</Typography>
                <Box height={20}/>
                <Typography>You can avail</Typography>
                <Typography variant="h3" color="secondary">{findRemainingBunkableDays()}</Typography>
                <Typography>More days leave</Typography>
            </CardContent>
        </Card>
    );
}