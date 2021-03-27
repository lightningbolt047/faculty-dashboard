import MentoringStudentAccordion from '../../components/MentoringStudentAccordion';
import SearchBar from '../../components/SearchBar';
import backendQuery from '../../services/backendServices';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
var studentsDetails=[];

export default function MentorDiary(){

    const [statusCode,setStatusCode]=useState(0);
    var [shownStudentsDetails,setShownStudentsDetails]=useState([]);

    const [mentoringDiaries,setMentoringDiaries]=useState([]);
    const [showSearchText,setShowSearchText]=useState('');
    var searchText='';
    const [openSnackbar,setOpenSnackbar]=useState(false);
    const [sendStatusCode,setSendStatusCode]=useState(0);
    // const [studentsDetails,setStudentsDetails]=useState([]);



    const getInfoFromBackend=async ()=>{
        var responseBody=await backendQuery('GET',`/mentoring/`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        // if(responseBody.statusCode===404){

        // }
        if(responseBody.statusCode===200){
            studentsDetails=responseBody;
        }
        setStatusCode(responseBody.statusCode);
    };

    const sendMentoringTextToBackend=async (studentID,accordionID)=>{
        var responseBody=await backendQuery('POST',`/mentoring/`,
            {
                studentID:studentID,
                mentorText:mentoringDiaries[accordionID]
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        setSendStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            setOpenSnackbar(true);
        }
    }

    const getSearchResults=()=>{
        var filteredResults=[];
        if(searchText==='' || typeof searchText==='undefined'){
            for(let i=0;i<studentsDetails.length;i++){
                filteredResults.push(studentsDetails[i]);
            }
        }
        else{
            for(let i=0;i<studentsDetails.length;i++){
                if(studentsDetails[i].personalDetails.studentID.name.toLowerCase().includes(searchText.toLowerCase()) || studentsDetails[i].personalDetails.studentID.clgID.toLowerCase().includes(searchText.toLowerCase())){
                    filteredResults.push(studentsDetails[i]);
                }
            }
        }
        filteredResults.sort((a,b)=>{
            return parseInt(a.personalDetails.studentID.clgID.slice(a.personalDetails.studentID.clgID.length-5))-parseInt(b.personalDetails.studentID.clgID.slice(b.personalDetails.studentID.clgID.length-5))
        });
        setShownStudentsDetails(filteredResults);
        setMentoringTextArray(filteredResults);
    }

    const setMentoringTextArray=(filteredResults)=>{
        var mentoringDiariesText=[];
        for(let i=0;i<filteredResults.length;i++){       
            mentoringDiariesText.push(filteredResults[i].personalDetails.mentorText);
        }
        setMentoringDiaries(mentoringDiariesText);
    }

    const handleSnackbarClose=(event,reason)=>{
        if (reason!=='clickaway'){
            setOpenSnackbar(false);
        }
    }


    useEffect(()=>{
        async function fetchFromServer(){
            await getInfoFromBackend();
            getSearchResults();
        }
        fetchFromServer();
        //eslint-disable-next-line
    },[]);

    const handleMentorTextChange=(accordionID,event)=>{
        var mentorTexts=[];
        mentoringDiaries[accordionID]=event.target.value;
        for(let i=0;i<mentoringDiaries.length;i++){
            mentorTexts.push(mentoringDiaries[i]);
        }
        setMentoringDiaries(mentorTexts);
    }

    const handleSearchTextChange=(event)=>{
        setShowSearchText(event.target.value);
        searchText=event.target.value;
        getSearchResults();
    }

    const successDiv=()=>{
        return (
            <div>
                {sendStatusCode===200 && <Alert variant="filled" severity="success">
                    Mentor Diary updated successfully
                </Alert>}
            </div>
        );
    }

    const getAccordionUI=()=>{
        return (
            <div>
                <SearchBar searchText={showSearchText} searchHelpText={"Search"} handleSearchTextChange={handleSearchTextChange}/>
                <Box height={10}/>
                {shownStudentsDetails.map((studentItem,index)=>(
                <div>
                    <MentoringStudentAccordion key={index} accordionID={index} studentJSON={studentItem} mentorDairyText={mentoringDiaries[index]} handleMentorTextChange = {handleMentorTextChange} handleMentorTextSubmit={sendMentoringTextToBackend}/>
                </div>
                ))}
                <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                    {successDiv()}
                </Snackbar>
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
    


    return (
        <div>
            {statusCode===200 && getAccordionUI()}
            <Box height={12}/>
            {statusCode!==200 && statusCode!==404 && <CircularProgress size={24} color="secondary"/>}
            {statusCode===404 && errDiv()}          
        </div>
        

    );
}