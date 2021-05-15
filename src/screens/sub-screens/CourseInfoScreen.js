import {useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import backendService from "../../services/backendService";
import CourseTabScreen from "./CourseTabScreen";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";


let key=1;
export default function CourseInfoScreen(){
    const [tabIndex,setTabIndex]=useState(0);
    const [courses,setCourses]=useState([]);
    const [dataAvailable,setDataAvailable]=useState(false);
    const [statusCode,setStatusCode]=useState(0);


    const getCoursesFromBackend=async ()=>{
        setDataAvailable(false);
        let responseBody=await backendService('GET','/courseNotes',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setCourses(responseBody);
            setDataAvailable(true);
        }
        setStatusCode(responseBody.statusCode);
    }

    const handleTabIndexChange=(event,value)=>{
        setTabIndex(value);
        key+=1;
    }

    useEffect(()=>{
        getCoursesFromBackend();
    },[]);

    const getMainUI=()=>{
        return (
            <div>
                <Paper variant="outlined">
                    <Tabs value={tabIndex} onChange={handleTabIndexChange}>
                        {courses.map((item,index)=>(
                            <Tab label={item.courseName} id={`courseTab${index}`}/>
                        ))}
                    </Tabs>
                </Paper>
                <CourseTabScreen key={key} course={courses[tabIndex]}/>
            </div>
        );
    }

    return (
        <div>
            {dataAvailable && getMainUI()}
            <Box height={12}/>
            {!dataAvailable && statusCode===0 && <CircularProgress size={24} color="secondary"/>}
            {statusCode===404 && <div id='mentorNotAllocated'>
                <Alert variant="filled" severity="error">
                    You have not been assigned a course
                </Alert>
            </div>}
        </div>

    );
}