import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import CourseNotes from "../../components/CourseNotes";
import Forum from '../../components/Forum';
import Divider from "@material-ui/core/Divider";



export default function CourseTabScreen({course}){
    return (
        <div>
            <Box height={10}/>
            <Grid container id="courseTabsDiv">
                <Box flex={1}>
                    <CourseNotes/>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box flex={1}>
                    <Forum/>
                </Box>
            </Grid>
        </div>
    );
}