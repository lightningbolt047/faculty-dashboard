import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function HodLeaveStatusCard({isLoading,numLeavesPending}){

    return (
        <Card className='homeRowcard' variant="outlined">
            <CardContent>
                <Box flex={1}/>
                <Typography  variant="h5" color={"secondary"} component="h2">
                    Leave Requests Approval
                </Typography>
                <Box height={10}/>
                <Typography>You Have </Typography>
                <Typography variant="h2" color={'secondary'}>
                    {!isLoading && numLeavesPending}
                    {isLoading && <CircularProgress size={24} color="secondary"/>}
                </Typography>
                <Typography>Leave Requests To Approve</Typography>
                <Box height={20}/>
            </CardContent>
        </Card>
    );
}