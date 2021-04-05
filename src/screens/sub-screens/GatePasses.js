import GatePassStudentAccordion from '../../components/GatePassStudentAccordion';
import SearchBar from '../../components/SearchBar';
import backendService from '../../services/backendService';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import Alert from '@material-ui/lab/Alert';
import Typography from "@material-ui/core/Typography";
import WarningIcon from "@material-ui/icons/Warning";
import ExploreIcon from '@material-ui/icons/Explore';
import LockIcon from "@material-ui/icons/Lock";
import CancelIcon from '@material-ui/icons/Cancel';
let studentsDetails=[];

export default function GatePasses(){

    const [statusCode,setStatusCode]=useState(0);
    let [shownStudentsDetails,setShownStudentsDetails]=useState([]);
    const [showSearchText,setShowSearchText]=useState('');
    let searchText='';
    // const [openSnackbar,setOpenSnackbar]=useState(false);
    // const [sendStatusCode,setSendStatusCode]=useState(0);
    // const [studentsDetails,setStudentsDetails]=useState([]);



    const getInfoFromBackend=async ()=>{
        let responseBody=await backendService('GET',`/mentoring/`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        // if(responseBody.statusCode===404){

        // }
        if(responseBody.statusCode===200){
            studentsDetails=responseBody;
        }
        setStatusCode(responseBody.statusCode);
    };

    const getSearchResults=()=>{
        let filteredResults=[];
        if(searchText==='' || typeof searchText==='undefined'){
            filteredResults=studentsDetails;
        }
        else{
            for(const studentDetailIteration of studentsDetails){
                if(studentDetailIteration.personalDetails.studentID.name.toLowerCase().includes(searchText.toLowerCase()) || studentDetailIteration.personalDetails.studentID.clgID.toLowerCase().includes(searchText.toLowerCase())){
                    filteredResults.push(studentDetailIteration);
                }
            }
        }
        filteredResults.sort((a,b)=>{
            return parseInt(a.personalDetails.studentID.clgID.slice(a.personalDetails.studentID.clgID.length-5))-parseInt(b.personalDetails.studentID.clgID.slice(b.personalDetails.studentID.clgID.length-5))
        });
        setShownStudentsDetails(filteredResults);
    }


    useEffect(()=>{
        async function fetchFromServer(){
            await getInfoFromBackend();
            getSearchResults();
        }
        fetchFromServer();
        //eslint-disable-next-line
    },[]);

    const handleSearchTextChange=(event)=>{
        setShowSearchText(event.target.value);
        searchText=event.target.value;
        getSearchResults();
    }

    const getAccordionUI=()=>{
        return (
            <div>
                <SearchBar searchText={showSearchText} searchHelpText={"Search"} handleSearchTextChange={handleSearchTextChange}/>
                <Box height={18}/>
                {shownStudentsDetails.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <WarningIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Emergency Passes</Typography>
                </div>}
                {shownStudentsDetails.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} studentJSON={studentItem}/>
                    </div>
                ))}
                <Box height={18}/>
                {shownStudentsDetails.length!==0 && <div className={'gatePassSegmentRegular'}>
                    <ExploreIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Regular Passes</Typography>
                </div>}
                {shownStudentsDetails.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} studentJSON={studentItem}/>
                    </div>
                ))}
                <Box height={18}/>
                {shownStudentsDetails.length!==0 && <div className={'gatePassSegmentWithheld'}>
                    <LockIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Withheld Passes</Typography>
                </div>}
                {shownStudentsDetails.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} studentJSON={studentItem}/>
                    </div>
                ))}
                <Box height={18}/>
                {shownStudentsDetails.length!==0 && <div className={'gatePassSegmentCancelled'}>
                    <CancelIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Cancelled Passes</Typography>
                </div>}
                {shownStudentsDetails.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} studentJSON={studentItem}/>
                    </div>
                ))}
            </div>
        );
    }

    const errDiv=()=>{
        return (
            <div id='mentorNotAllocated'>
                <Alert variant="filled" severity="error">
                    You have not been assigned to a class
                </Alert>
            </div>
        );
    }

    // const handleSnackbarClose=(event,reason)=>{
    //     if (reason!=='clickaway'){
    //         setOpenSnackbar(false);
    //     }
    // }



    return (
        <div>
            {statusCode===200 && getAccordionUI()}
            <Box height={12}/>
            {statusCode!==200 && statusCode!==404 && <CircularProgress size={24} color="secondary"/>}
            {statusCode===404 && errDiv()}
        </div>


    );
}