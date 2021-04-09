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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
let allStudentPasses=[];

export default function GatePasses({passRoute}){

    const [statusCode,setStatusCode]=useState(0);
    let allShownPasses=[];
    let [shownEmergencyPasses,setShownEmergencyPasses]=useState([]);
    let [shownRegularPasses,setShownRegularPasses]=useState([]);
    let [shownWithheldPasses,setShownWithheldPasses]=useState([]);
    let [shownCancelledPasses,setShownCancelledPasses]=useState([]);
    let [shownApprovedPasses,setShownApprovedPasses]=useState([]);

    const [showSearchText,setShowSearchText]=useState('');
    let searchText='';
    // const [openSnackbar,setOpenSnackbar]=useState(false);
    // const [sendStatusCode,setSendStatusCode]=useState(0);
    // const [studentsDetails,setStudentsDetails]=useState([]);



    const getInfoFromBackend=async ()=>{
        let responseBody=await backendService('GET',`/${passRoute}/`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        // if(responseBody.statusCode===404){

        // }
        if(responseBody.statusCode===200){
            allStudentPasses=responseBody;
        }
        setStatusCode(responseBody.statusCode);
    };

    const sendPassStatusUpdateToBackend=async (passID,passStatusNewValue)=>{
        let responseBody=await backendService('POST',`/${passRoute}/`,
            {
                passID:passID,
                passStatus:passStatusNewValue
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        return responseBody.statusCode;
    }

    const handlePassStatusChange=async (passID,curPassIndex,curPassType,passStatusNewValue)=>{
        if(await sendPassStatusUpdateToBackend(passID,passStatusNewValue)===200){
            let pass;
            if(curPassType==='emergency'){
                pass=shownEmergencyPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownEmergencyPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownEmergencyPasses(tempPassList);
            }
            else if(curPassType==='approved'){
                pass=shownApprovedPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownApprovedPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownApprovedPasses(tempPassList);
            }
            else if(curPassType==='regular'){
                pass=shownRegularPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownRegularPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownRegularPasses(tempPassList);
            }
            else if(curPassType==='withheld'){
                pass=shownWithheldPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownWithheldPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownWithheldPasses(tempPassList);
            }
            else if(curPassType==='cancelled'){
                pass=shownCancelledPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownCancelledPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownCancelledPasses(tempPassList);
            }
            let tempPassList=[];
            if(passStatusNewValue==='approved'){
                for(let i=0;i<shownApprovedPasses.length-1;i++){
                    let curIndexRollValue=parseInt(shownApprovedPasses[i].personalDetails.clgID.slice(shownApprovedPasses[i].personalDetails.clgID.length-5));
                    let nextIndexRollValue=parseInt(shownApprovedPasses[i+1].personalDetails.clgID.slice(shownApprovedPasses[i+1].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    tempPassList.push(shownApprovedPasses[i]);
                    if(curIndexRollValue<passRollValue && passRollValue<nextIndexRollValue){
                        tempPassList.push(pass);
                    }
                }
                if(shownApprovedPasses.length===0){
                    tempPassList.push(pass);
                }
                else if(shownApprovedPasses.length===1){
                    let zeroIndexRollValue=parseInt(shownApprovedPasses[0].personalDetails.clgID.slice(shownApprovedPasses[0].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    if(zeroIndexRollValue<passRollValue){
                        tempPassList.push(shownApprovedPasses[0]);
                        tempPassList.push(pass);
                    }
                    else{
                        tempPassList.push(pass);
                        tempPassList.push(shownApprovedPasses[0]);
                    }
                }
                setShownApprovedPasses(tempPassList);
            }
            else if(passStatusNewValue==='withheld'){
                for(let i=0;i<shownWithheldPasses.length-1;i++){
                    let curIndexRollValue=parseInt(shownWithheldPasses[i].personalDetails.clgID.slice(shownWithheldPasses[i].personalDetails.clgID.length-5));
                    let nextIndexRollValue=parseInt(shownWithheldPasses[i+1].personalDetails.clgID.slice(shownWithheldPasses[i+1].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    tempPassList.push(shownWithheldPasses[i]);
                    if(curIndexRollValue<passRollValue && passRollValue<nextIndexRollValue){
                        tempPassList.push(pass);
                    }
                }
                if(shownWithheldPasses.length===0){
                    tempPassList.push(pass);
                }
                else if(shownWithheldPasses.length===1){
                    let zeroIndexRollValue=parseInt(shownWithheldPasses[0].personalDetails.clgID.slice(shownWithheldPasses[0].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    if(zeroIndexRollValue<passRollValue){
                        tempPassList.push(shownWithheldPasses[0]);
                        tempPassList.push(pass);
                    }
                    else{
                        tempPassList.push(pass);
                        tempPassList.push(shownWithheldPasses[0]);
                    }
                }
                setShownWithheldPasses(tempPassList);
            }
            else if(passStatusNewValue==='cancelled'){
                for(let i=0;i<shownCancelledPasses.length-1;i++){
                    let curIndexRollValue=parseInt(shownCancelledPasses[i].personalDetails.clgID.slice(shownCancelledPasses[i].personalDetails.clgID.length-5));
                    let nextIndexRollValue=parseInt(shownCancelledPasses[i+1].personalDetails.clgID.slice(shownCancelledPasses[i+1].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    tempPassList.push(shownCancelledPasses[i]);
                    if(curIndexRollValue<passRollValue && passRollValue<nextIndexRollValue){
                        tempPassList.push(pass);
                    }
                }
                if(shownCancelledPasses.length===0){
                    tempPassList.push(pass);
                }
                else if(shownCancelledPasses.length===1){
                    let zeroIndexRollValue=parseInt(shownCancelledPasses[0].personalDetails.clgID.slice(shownCancelledPasses[0].personalDetails.clgID.length-5));
                    let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
                    if(zeroIndexRollValue<passRollValue){
                        tempPassList.push(shownCancelledPasses[0]);
                        tempPassList.push(pass);
                    }
                    else{
                        tempPassList.push(pass);
                        tempPassList.push(shownCancelledPasses[0]);
                    }
                }
                setShownCancelledPasses(tempPassList);
            }
        }
    }

    const getTypeName=()=>{
        if(passRoute==='gatepass'){
            return 'Passes';
        }
        else if(passRoute==='studentMedical'){
            return 'Leaves';
        }
    }

    const getSearchResults=()=>{
        let filteredResults=[];
        if(searchText==='' || typeof searchText==='undefined'){
            filteredResults=allStudentPasses;
        }
        else{
            for(const studentDetailIteration of allStudentPasses){
                if(studentDetailIteration.personalDetails.name.toLowerCase().includes(searchText.toLowerCase()) || studentDetailIteration.personalDetails.clgID.toLowerCase().includes(searchText.toLowerCase())){
                    filteredResults.push(studentDetailIteration);
                }
            }
        }
        filteredResults.sort((a,b)=>{
            return parseInt(a.personalDetails.clgID.slice(a.personalDetails.clgID.length-5))-parseInt(b.personalDetails.clgID.slice(b.personalDetails.clgID.length-5))
        });
        allShownPasses=filteredResults;
        splitPassesByType();
    }

    const splitPassesByType=()=>{
        let regularPassList=[],emergencyPassList=[],withheldPassList=[],cancelledPassList=[],approvedPassList=[];
        for(let pass of allShownPasses){
            if(pass.passDetails.passStatus==='approved'){
                approvedPassList.push(pass);
                continue;
            }
            if(pass.passDetails.emergencyPass && pass.passDetails.passStatus==='pending'){
                emergencyPassList.push(pass);
                continue;
            }
            if(pass.passDetails.passStatus==='pending'){
                regularPassList.push(pass);
                continue;
            }
            if(pass.passDetails.passStatus==='cancelled'){
                cancelledPassList.push(pass);
                continue;
            }
            if(pass.passDetails.passStatus==='withheld'){
                withheldPassList.push(pass);
            }
        }
        setShownEmergencyPasses(emergencyPassList);
        setShownRegularPasses(regularPassList);
        setShownCancelledPasses(cancelledPassList);
        setShownWithheldPasses(withheldPassList);
        setShownApprovedPasses(approvedPassList);
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
                {shownEmergencyPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <Box height={18}/>
                </div>}
                {shownEmergencyPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <WarningIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Emergency {getTypeName()}</Typography>
                </div>}
                {shownEmergencyPasses.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} passType={'emergency'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute={passRoute}/>
                    </div>
                ))}
                {shownRegularPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <Box height={18}/>
                </div>}
                {shownRegularPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                    <ExploreIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Regular {getTypeName()}</Typography>
                </div>}
                {shownRegularPasses.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} passType={'regular'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute={passRoute}/>
                    </div>
                ))}
                {shownWithheldPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <Box height={18}/>
                </div>}
                {shownWithheldPasses.length!==0 && <div className={'gatePassSegmentWithheld'}>
                    <LockIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Withheld {getTypeName()}</Typography>
                </div>}
                {shownWithheldPasses.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} passType={'withheld'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute={passRoute}/>
                    </div>
                ))}
                {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                    <Box height={18}/>
                </div>}
                {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentCancelled'}>
                    <CancelIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Cancelled {getTypeName()}</Typography>
                </div>}
                {shownCancelledPasses.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} passType={'cancelled'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute={passRoute}/>
                    </div>
                ))}
                {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                    <Box height={18}/>
                </div>}
                {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                    <CheckCircleIcon fontSize={'large'}/>
                    <Typography variant={'h4'} id={'gatePassSegmentText'}>Approved {getTypeName()}</Typography>
                </div>}
                {shownApprovedPasses.map((studentItem,index)=>(
                    <div>
                        <GatePassStudentAccordion key={index} accordionID={index} passType={'approved'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute={passRoute}/>
                    </div>
                ))}
            </div>
        );
    };

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