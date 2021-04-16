import {useEffect, useState} from 'react';
import GatePasses from "./GatePasses";
import Paper from '@material-ui/core/Paper';
import 'aos/dist/aos.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import backendService from "../../services/backendService";
import GatePassStudentAccordion from "../../components/GatePassStudentAccordion";
import CourseTabScreen from "./CourseTabScreen";


function GetTabIndexUI({tabIndex}){
    return (
        <div>
            {<CourseTabScreen passRoute={coursesRedirection[tabIndex]}/>}
        </div>
    );
}

let coursesRedirection=[];


export default function StudentGatePassMedical(){
    const [tabIndex,setTabIndex]=useState(0);
    const [courses,setCourses]=useState([]);


    const getCoursesFromBackend=async ()=>{
        let responseBody=await backendService('GET','/courseNotes',
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setCourses(responseBody);
            coursesRedirection=responseBody;
        }
    }

    const handleTabIndexChange=(event,value)=>{
        setTabIndex(value);
    }

    useEffect(()=>{
        getCoursesFromBackend();
    },[]);

    return (
        <div>
            <Paper variant="outlined">
                <Tabs value={tabIndex} onChange={handleTabIndexChange}>
                    {courses.map((item,index)=>(
                        <Tab label={item.courseName}/>
                    ))}
                </Tabs>
            </Paper>
            <GetTabIndexUI tabIndex={tabIndex}></GetTabIndexUI>
        </div>

    );
}