import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CourseNotesAccordion from './CourseNotesAccordion';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backendService from "../services/backendService";
import {useState,useEffect} from "react";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


let courseNotesFromServer=[];
let dateISO;
export default function CourseNotes({course}){
    const [open, setOpen] = useState(false);
    const [courseNotes,setCourseNotes]=useState([]);
    const [noteDate,setNoteDate]=useState();
    const [note,setNote]=useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleNewNoteAdd = () => {
        setOpen(false);
    };

    const handleNewNoteCancel=()=>{
        setOpen(false);
    }

    const handleDateChange=(e)=>{
        setNoteDate(e.target.value);
        dateISO=dateToISO(e.target.value);
        console.log(dateISO);
    }

    const handleNoteChange=(e)=>{
        setNote(e.target.value);
        console.log(e.target.value);
    }

    const dateToISO=(inputDate)=>{
        if(inputDate!=='' && typeof inputDate!=='undefined'){
            return new Date(inputDate).toISOString();
        }
    }


    const getCourseNotesFromServer=async ()=>{
        let responseBody=await backendService('GET',`/courseNotes/${course.courseID}`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            courseNotesFromServer=responseBody.notes;
            getSortedOrder();
        }
    }

    const getSortedOrder=()=>{
        courseNotesFromServer.sort((a,b)=>{
            return Date.parse(b.date)-Date.parse(a.date);
        });
        setCourseNotes(courseNotesFromServer);
    }


    useEffect(()=>{
        getCourseNotesFromServer();
        // eslint-disable-next-line
    },[]);

    return (
        <div>
            <Typography variant="h5" color="secondary">Daily Course Progress</Typography>
            {courseNotes.map((item,index)=>(
                <CourseNotesAccordion note={item}/>
            ))}
            <Box height={10}/>
            <Fab className="floatingBtns" color="secondary" onClick={handleClickOpen}>
                <AddIcon/>
            </Fab>
            <Dialog open={open} onClose={handleNewNoteCancel} aria-labelledby="form-dialog-title">
            <DialogTitle>
                <Typography variant="h5" color="secondary">Add New Note</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter date and corresponding notes to maintain your daily progress.
                </DialogContentText>
                <TextField variant="outlined" color="secondary" value={noteDate} onChange={handleDateChange} label="Date" InputLabelProps={{ shrink: true }} type="date" fullWidth/>
                <Box height={10}/>
                <TextField variant="outlined" color="secondary" value={note} onChange={handleNoteChange} label="Notes" type="text" fullWidth/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleNewNoteCancel} color="primary">
                Cancel
            </Button>
            <Button onClick={handleNewNoteAdd} color="primary">
                Add Note
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}