import ForumPostAccordion from './ForumPostAccordion';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';



export default function Forum({course}){
    return (
        <div>
            <Typography variant="h5" color="secondary">Forum</Typography>
            <ForumPostAccordion/>
            <ForumPostAccordion/>
            <ForumPostAccordion/>
            <Box height={10}/>
            <Fab className="floatingBtns" color="secondary">
                <AddIcon/>
            </Fab>
        </div>
    );
}