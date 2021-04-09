import MentoringStudentAccordion from '../../components/MentoringStudentAccordion';
import SearchBar from '../../components/SearchBar';
import backendService from '../../services/backendService';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import FlipMove from 'react-flip-move';

let studentsDetails = [];

export default function MentorDiary(){

    const [statusCode,setStatusCode]=useState(0);
    let [shownStudentsDetails, setShownStudentsDetails] = useState([]);

    const [mentoringDiaries,setMentoringDiaries]=useState([]);
    const [showSearchText,setShowSearchText]=useState('');
    let searchText = '';
    const [openSnackbar,setOpenSnackbar]=useState(false);
    const [sendStatusCode,setSendStatusCode]=useState(0);



    const getInfoFromBackend=async ()=>{
        const responseBody = await backendService('GET', `/mentoring/`,
            {}, sessionStorage.USER_AUTH_TOKEN, sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            studentsDetails=responseBody;
        }
        setStatusCode(responseBody.statusCode);
    };

    const sendMentoringTextToBackend=async (studentID,accordionID,advisorAllocationID)=>{
        const responseBody = await backendService('POST', `/mentoring/`,
            {
                advisorAllocationID: advisorAllocationID,
                studentID: studentID,
                mentorText: mentoringDiaries[accordionID]
            }, sessionStorage.USER_AUTH_TOKEN, sessionStorage.USER_DB_ID
        );
        setSendStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            setOpenSnackbar(true);
        }
    }

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
        setMentoringTextArray(filteredResults);
    }

    const setMentoringTextArray=(filteredResults)=>{
        let mentoringDiariesText=[];
        for(let filteredResultsIteration of filteredResults){
            mentoringDiariesText.push(filteredResultsIteration.personalDetails.mentorText);
        }
        setMentoringDiaries(mentoringDiariesText);
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
        let mentorTexts=[];
        mentoringDiaries[accordionID]=event.target.value;
        for(let mentorText of mentoringDiaries){
            mentorTexts.push(mentorText);
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
                <FlipMove>
                    {shownStudentsDetails.map((studentItem,index)=>(
                        <div>
                            <MentoringStudentAccordion key={index} accordionID={index} studentJSON={studentItem} mentorDairyText={mentoringDiaries[index]} handleMentorTextChange = {handleMentorTextChange} handleMentorTextSubmit={sendMentoringTextToBackend}/>
                        </div>
                    ))}
                </FlipMove>
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

    const handleSnackbarClose=(event,reason)=>{
        if (reason!=='clickaway'){
            setOpenSnackbar(false);
        }
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