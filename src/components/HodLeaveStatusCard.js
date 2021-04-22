import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";


export default function HodLeaveStatusCard(){

    return (
        <Card className='homeRowcard' variant="outlined">
            <CardContent>
                <Box flex={1}/>
                <Typography  variant="h5" color={"secondary"} component="h2">
                    Leave Requests Approval
                </Typography>
                <Box height={10}/>
                <Typography>You Still Have </Typography>
                <Typography variant="h2">5</Typography>
                <Typography>Leave Requests To Be Approved</Typography>
                <Box height={20}/>
            </CardContent>
        </Card>
    );
}