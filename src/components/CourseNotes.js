import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CourseNotesAccordion from './CourseNotesAccordion';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default function CourseNotes({course}){
    return (
        <div>
            <Typography variant="h5" color="secondary">Daily Course Progress</Typography>
            <CourseNotesAccordion/>
            <CourseNotesAccordion/>
            <CourseNotesAccordion/>
            <CourseNotesAccordion/>
            <CourseNotesAccordion/>
            <CourseNotesAccordion/>
            <Box height={10}/>
            <Fab className="floatingBtns" color="secondary">
                <AddIcon/>
            </Fab>
        </div>
    );
}