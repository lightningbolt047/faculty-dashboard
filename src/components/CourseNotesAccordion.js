import {useState} from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DateServices from "../services/DateServices";
import TimeTableServices from "../services/TimeTableServices";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from "@material-ui/core/Dialog";
import {DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

export default function CourseNotesAccordion({accordionID,note,handleDeleteNote}){

    const noteDate=new Date(note.date);
    const [dialogOpen,setDialogOpen]=useState(false);

    const handleDialogClose=()=>{
        setDialogOpen(false);
    }
    const handleDialogOpen=()=>{
        setDialogOpen(true);
    }

    const handleDeleteIconAction=(e)=>{
        e.stopPropagation();
        handleDialogOpen();
    }

    const handleDeleteButtonClick=async ()=>{
        await handleDeleteNote(accordionID);
        setDialogOpen(false);
    }


    return (
        <div className="accordionSpace">
            <Accordion>
                <AccordionSummary id={`courseNotesAccordion${accordionID}`} expandIcon={<ExpandMoreIcon />}>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">Date: <b>{DateServices.getDateAsString(noteDate)+" "+DateServices.getDayStringFromDateObject(noteDate)}</b> </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className="accordionText" id="accordionTextSecondary">Hour: <b>{TimeTableServices.getTimeRangeFromHour(note.hour)}</b></Typography>
                    </Box>
                    <IconButton size={'small'} id={`courseNotesAccordionDelete${accordionID}`} onClick={handleDeleteIconAction}>
                        <DeleteForeverIcon/>
                    </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Box flex={1}>
                            <div className='accordionDividerContent'>
                                <b>Note</b>: {note.notes}
                                <Box height={4}/>
                            </div>
                        </Box>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Dialog open={dialogOpen}>
                <DialogTitle>
                    <Typography variant="h5" color="secondary">Are you sure?</Typography>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure about deleting this note?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary" id={`courseNotesDeleteNoteDiscardButton`}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteButtonClick} color="secondary" id={`courseNotesDeleteNoteButton`}>
                            Delete
                        </Button>
                    </DialogActions>
                </DialogTitle>
            </Dialog>

        </div>
    );
}