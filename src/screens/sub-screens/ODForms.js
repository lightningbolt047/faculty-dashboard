import SearchBar from '../../components/SearchBar';
import backendService from '../../services/backendService';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import Alert from '@material-ui/lab/Alert';
import GatePassStudentAccordion from '../../components/GatePassStudentAccordion';
import Typography from "@material-ui/core/Typography";
import ExploreIcon from "@material-ui/icons/Explore";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

let allStudentPasses = [];

export default function ODForms(){
    const [statusCode,setStatusCode]=useState(0);
    let allShownPasses=[];
    let [shownRegularPasses,setShownRegularPasses]=useState([]);
    let [shownCancelledPasses,setShownCancelledPasses]=useState([]);
    let [shownApprovedPasses,setShownApprovedPasses]=useState([]);

    const [showSearchText,setShowSearchText]=useState('');
    let searchText='';



    const getInfoFromBackend=async ()=>{
        let responseBody=await backendService('GET',`/odform/`,
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
        let responseBody=await backendService('POST',`/odform/`,
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
            if(curPassType==='approved'){
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
            else if(curPassType==='cancelled'){
                pass=shownCancelledPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownCancelledPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownCancelledPasses(tempPassList);
            }
            for(let i=0;i<pass.passDetails.affectedClasses.length;i++){
                pass.passDetails.affectedClasses[i]=passStatusNewValue;
            }
            let tempPassList=[];
            let added=false;
            let passRollValue=parseInt(pass.personalDetails.clgID.slice(pass.personalDetails.clgID.length-5));
            if(passStatusNewValue==='approved'){
                for(let i=0;i<shownApprovedPasses.length-1;i++){
                    let curIndexRollValue=parseInt(shownApprovedPasses[i].personalDetails.clgID.slice(shownApprovedPasses[i].personalDetails.clgID.length-5));
                    let nextIndexRollValue=parseInt(shownApprovedPasses[i+1].personalDetails.clgID.slice(shownApprovedPasses[i+1].personalDetails.clgID.length-5));
                    if(passRollValue<curIndexRollValue && i===0){
                        tempPassList.push(pass);
                        added=true;
                    }
                    tempPassList.push(shownApprovedPasses[i]);
                    if(passRollValue>=curIndexRollValue && passRollValue<=nextIndexRollValue && !added){
                        tempPassList.push(pass);
                        added=true;
                    }
                    if(i===shownApprovedPasses.length-2){
                        tempPassList.push(shownApprovedPasses[i+1]);
                        if(!added){
                            tempPassList.push(pass);
                            added=true;
                        }
                    }
                }
                if(shownApprovedPasses.length===0){
                    tempPassList.push(pass);
                }
                else if(shownApprovedPasses.length===1){
                    let zeroIndexRollValue=parseInt(shownApprovedPasses[0].personalDetails.clgID.slice(shownApprovedPasses[0].personalDetails.clgID.length-5));
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
            else if(passStatusNewValue==='cancelled'){
                for(let i=0;i<shownCancelledPasses.length-1;i++){
                    let curIndexRollValue=parseInt(shownCancelledPasses[i].personalDetails.clgID.slice(shownCancelledPasses[i].personalDetails.clgID.length-5));
                    let nextIndexRollValue=parseInt(shownCancelledPasses[i+1].personalDetails.clgID.slice(shownCancelledPasses[i+1].personalDetails.clgID.length-5));
                    if(passRollValue<curIndexRollValue && i===0){
                        tempPassList.push(pass);
                        added=true;
                    }
                    tempPassList.push(shownCancelledPasses[i]);
                    if(passRollValue>=curIndexRollValue && passRollValue<=nextIndexRollValue && !added){
                        tempPassList.push(pass);
                        added=true;
                    }
                    if(i===shownCancelledPasses.length-2){
                        tempPassList.push(shownCancelledPasses[i+1]);
                        if(!added){
                            tempPassList.push(pass);
                            added=true;
                        }
                    }
                }
                if(shownCancelledPasses.length===0){
                    tempPassList.push(pass);
                }
                else if(shownCancelledPasses.length===1){
                    let zeroIndexRollValue=parseInt(shownCancelledPasses[0].personalDetails.clgID.slice(shownCancelledPasses[0].personalDetails.clgID.length-5));
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
            allShownPasses=[];
            allStudentPasses=[];
            for(const presentPass of shownRegularPasses){
                allShownPasses.push(presentPass);
                allStudentPasses.push(presentPass);
            }
            for(const presentPass of shownCancelledPasses){
                allShownPasses.push(presentPass);
                allStudentPasses.push(presentPass);
            }
            for(const presentPass of shownApprovedPasses){
                allShownPasses.push(presentPass);
                allStudentPasses.push(presentPass);
            }


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
        let regularPassList=[],cancelledPassList=[],approvedPassList=[];
        for(let pass of allShownPasses){
            if(pass.passDetails.affectedClasses.length===0){
                continue;
            }
            else if(pass.passDetails.affectedClasses[0].approvalStatus==='approved'){
                approvedPassList.push(pass);
            }
            else if(pass.passDetails.affectedClasses[0].approvalStatus==='pending'){
                regularPassList.push(pass);
            }
            else if(pass.passDetails.affectedClasses[0].approvalStatus==='cancelled'){
                cancelledPassList.push(pass);
            }
        }
        setShownRegularPasses(regularPassList);
        setShownCancelledPasses(cancelledPassList);
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
                    {shownRegularPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                        <Box height={18}/>
                    </div>}
                    {shownRegularPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                        <ExploreIcon fontSize={'large'}/>
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>Regular OD Requests</Typography>
                    </div>}
                    {shownRegularPasses.map((studentItem,index)=>(
                        <div>
                            <GatePassStudentAccordion key={index} accordionID={index} passType={'regular'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute='odform'/>
                        </div>
                    ))}
                    {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                        <Box height={18}/>
                    </div>}
                    {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentCancelled'}>
                        <CancelIcon fontSize={'large'}/>
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>Cancelled OD Requests</Typography>
                    </div>}
                    {shownCancelledPasses.map((studentItem,index)=>(
                        <div>
                            <GatePassStudentAccordion key={index} accordionID={index} passType={'cancelled'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute='odform'/>
                        </div>
                    ))}
                    {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                        <Box height={18}/>
                    </div>}
                    {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                        <CheckCircleIcon fontSize={'large'}/>
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>Approved OD Requests</Typography>
                    </div>}
                    {shownApprovedPasses.map((studentItem,index)=>(
                        <div>
                            <GatePassStudentAccordion key={index} accordionID={index} passType={'approved'} passJSON={studentItem} handlePassAction={handlePassStatusChange} passRoute='odform'/>
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