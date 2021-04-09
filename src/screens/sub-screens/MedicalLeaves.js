import SearchBar from '../../components/SearchBar';
import backendService from '../../services/backendService';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import Alert from '@material-ui/lab/Alert';
import GatePassStudentAccordion from '../../components/GatePassStudentAccordion';

let studentsDetails = [];

export default function MedicalLeaves(){

    const [statusCode,setStatusCode]=useState(0);
    let [shownStudentsDetails, setShownStudentsDetails] = useState([]);
    const [showSearchText,setShowSearchText]=useState('');
    let searchText = '';



    const getInfoFromBackend=async ()=>{
        const responseBody = await backendService('GET', `/studentMedical/`,
            {}, sessionStorage.USER_AUTH_TOKEN, sessionStorage.USER_DB_ID
        );
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
                if(studentDetailIteration.personalDetails.name.toLowerCase().includes(searchText.toLowerCase()) || studentDetailIteration.personalDetails.clgID.toLowerCase().includes(searchText.toLowerCase())){
                    filteredResults.push(studentDetailIteration);
                }
            }
        }
        filteredResults.sort((a,b)=>{
            return parseInt(a.personalDetails.clgID.slice(a.personalDetails.clgID.length-5))-parseInt(b.personalDetails.clgID.slice(b.personalDetails.clgID.length-5))
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
                <Box height={10}/>
                {shownStudentsDetails.map((studentItem,index)=>(
                <div>
                    <GatePassStudentAccordion key={index} accordionID={index} passJSON={studentItem}/>
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
    


    return (
        <div>
            {statusCode===200 && getAccordionUI()}
            <Box height={12}/>
            {statusCode!==200 && statusCode!==404 && <CircularProgress size={24} color="secondary"/>}
            {statusCode===404 && errDiv()}          
        </div>
        

    );
}