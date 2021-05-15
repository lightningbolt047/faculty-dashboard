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
import DateServices from '../services/DateServices';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { ExportToCsv } from 'export-to-csv';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TimeTableServices from "../services/TimeTableServices";
import CircularProgress from "@material-ui/core/CircularProgress";


let courseNotesFromServer=[];
let dateISO;
const hours=[0,1,2,3,4,5,6];
export default function CourseNotes({course}){
    const [open, setOpen] = useState(false);
    const [courseNotes,setCourseNotes]=useState([]);
    const [noteDate,setNoteDate]=useState();
    const [note,setNote]=useState("");
    const [courseNotesID,setCourseNotesID]=useState();
    const [selectedHour,setSelectedHour]=useState(hours[0]+1);
    const [getStatusCode,setGetStatusCode]=useState(0);


    const getCourseNotesFromServer=async ()=>{
        let responseBody=await backendService('GET',`/courseNotes/${course.courseID}`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            courseNotesFromServer=responseBody.notes;
            setCourseNotesID(responseBody._id);
            getSortedOrder();
        }
        setGetStatusCode(responseBody.statusCode);
    }

    const sendNewCourseNoteToServer=async ()=>{
        if(typeof noteDate==='undefined' || noteDate===''){
            return {statusCode:0};
        }
        let responseBody=await backendService('PUT',`/courseNotes/${course.courseID}`,
            {
                facultyCourseNotesID:courseNotesID,
                noteDate:dateISO,
                hour:selectedHour,
                noteText:note
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        setCourseNotesID(responseBody.facultyCourseNotesID);
        return responseBody;
    }

    const handleNewNoteAddition=async ()=>{
        if(typeof note==='undefined' || note===""){
            return
        }
        let responseFromServer=await sendNewCourseNoteToServer();
        if(responseFromServer.statusCode===200){
            let tempCourseNotes=[];
            tempCourseNotes.push({
                _id:responseFromServer.noteID,
                date:new Date(dateISO).toString(),
                hour:selectedHour,
                notes:note
            });
            for(const note of courseNotes){
                tempCourseNotes.push(note);
            }
            setCourseNotes(tempCourseNotes);
            setNote(undefined);
            setNoteDate(undefined);
            setOpen(false);
        }
    }

    const deleteNoteFromServer=async (accordionID)=>{
        let responseBody=await backendService('DELETE',`/courseNotes/${course.courseID}`,
            {
                facultyCourseNotesID: courseNotesID,
                noteID:courseNotes[accordionID]._id
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        )
        return responseBody.statusCode;
    }

    const handleNoteDeletion=async (accordionID)=>{
        if(await deleteNoteFromServer(accordionID)===200){
            let tempCourseNotes=[];
            for(let i=0;i<courseNotes.length;i++){
                if(i!==accordionID){
                    tempCourseNotes.push(courseNotes[i]);
                }
            }
            setCourseNotes(tempCourseNotes);
        }
    }

    const getAppropriateCSVData=()=>{
        let csvData=[];
        const csvOptions={
            fieldSeparator:',',
            quoteStrings:'"',
            decimalSeparator:'.',
            showLabels:true,
            name:"CourseNotes.csv",
            title:"CourseNotes.csv",
            useTextFile:false,
            useBom:true,
            useKeysAsHeaders:true
        };
        const csvExporter=new ExportToCsv(csvOptions);
        for(const document of courseNotes){
            csvData.push({
                Date:DateServices.getDateAsString(new Date(document.date)),
                hour:document.hour+1,
                StartTime:TimeTableServices.hourStartTimes[document.hour],
                EndTime:TimeTableServices.hourEndTimes[document.hour],
                Notes:document.notes
            });
        }

        csvData.sort((a,b)=>{
            if(Date.parse(b.date)===Date.parse(a.date)){
                return b.hour-a.hour;
            }
            return Date.parse(b.date)-Date.parse(a.date);
        });

        csvExporter.generateCsv(csvData);

        return csvData;
    }

    const getSortedOrder=()=>{
        courseNotesFromServer.sort((a,b)=>{
            if(Date.parse(b.date)===Date.parse(a.date)){
                return b.hour-a.hour;
            }
            return Date.parse(b.date)-Date.parse(a.date);
        });
        setCourseNotes(courseNotesFromServer);
    }


    useEffect(()=>{
        getCourseNotesFromServer();
        // eslint-disable-next-line
    },[]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleNewNoteCancel=()=>{
        setOpen(false);
    }

    const handleDateChange=(e)=>{
        setNoteDate(e.target.value);
        dateISO=DateServices.dateToISO(e.target.value);
    }

    const handleNoteChange=(e)=>{
        if(note==="" && e.target.value===" "){
            return;
        }
        setNote(e.target.value);
    }

    const handleSelectedHourChange=(e)=>{
        setSelectedHour(e.target.value);
    }

    return (
        <div>
            <Typography display={'inline'} variant="h5" color="secondary">Daily Course Progress
                <Button id = "downloadCSVButton" variant={'contained'} startIcon={<CloudDownloadIcon/>} color={'secondary'} onClick={getAppropriateCSVData}>
                    Download
                </Button>
            </Typography>
            {courseNotes.map((item,index)=>(
                <CourseNotesAccordion accordionID={index} note={item} handleDeleteNote={handleNoteDeletion}/>
            ))}
            <Box height={10}/>
            {getStatusCode===0 && <CircularProgress size={24} color="secondary"/>}
            {getStatusCode!==0 && <Fab className="floatingBtns" id={'courseNotesAddNewNoteFab'} color="secondary" onClick={handleClickOpen}>
                <AddIcon/>
            </Fab>}
            <Dialog open={open} onClose={handleNewNoteCancel} aria-labelledby="form-dialog-title">
            <DialogTitle>
                <Typography variant="h5" color="secondary">Add New Note</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter date and corresponding notes to maintain your daily progress.
                </DialogContentText>
                <TextField variant="outlined" color="secondary" value={noteDate} onChange={handleDateChange} label="Date" InputLabelProps={{ shrink: true }} type="date" fullWidth id={`courseNotesAddNewNoteDateTextField`}/>
                <Box height={10}/>
                <FormControl color={'secondary'} variant="outlined" id="hourDropdown">
                    <InputLabel>Hour</InputLabel>
                    <Select className="leftAlignDropdownText" id={'courseNotesAddNewNoteHourSelect'} value={selectedHour} onChange={handleSelectedHourChange} label="Hour">
                        {/*<MenuItem value="">Select</MenuItem>*/}
                        {hours.map((item,index)=>(
                            <MenuItem id={'hourSelector'+index} value={item}>Hour: {item+1} {TimeTableServices.getTimeRangeFromHour(item)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box height={10}/>
                <TextField variant="outlined" color="secondary" value={note} onChange={handleNoteChange} label="Notes" type="text" fullWidth id={`courseNotesAddNewNoteTextTextField`}/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleNewNoteCancel} color="secondary" id={`courseNotesAddNewNoteDiscardButton`}>
                Cancel
            </Button>
            <Button onClick={handleNewNoteAddition} color="secondary" id={`courseNotesAddNewNoteButton`}>
                Add Note
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}