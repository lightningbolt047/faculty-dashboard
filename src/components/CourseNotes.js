import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CourseNotesAccordion from './CourseNotesAccordion';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backendService from "../services/backendService";
import {useState,useEffect} from "react";

let courseNotesFromServer=[];

export default function CourseNotes({course}){

    const [courseNotes,setCourseNotes]=useState([]);

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
            <Fab className="floatingBtns" color="secondary">
                <AddIcon/>
            </Fab>
        </div>
    );
}