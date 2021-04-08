import {useState} from 'react';
import GatePasses from "./GatePasses";
import Paper from '@material-ui/core/Paper';
import 'aos/dist/aos.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


function GetTabIndexUI({tabIndex}){
    return (
        <div>
            {tabIndex===0 && <GatePasses/>}
            {tabIndex===1 && "Not hello"}
        </div>
    );
}


export default function StudentGatePassMedical(){
    const [tabIndex,setTabIndex]=useState(0);

    const handleTabIndexChange=(event,value)=>{
        setTabIndex(value);
    }

    return (
        <div>
            <Paper variant="outlined">
                <Tabs value={tabIndex} onChange={handleTabIndexChange}>
                    <Tab label={"Gate Passes"}/>
                    <Tab label={"Medical Leaves"}/>
                </Tabs>
            </Paper>
            <GetTabIndexUI tabIndex={tabIndex}></GetTabIndexUI>
        </div>

    );
}