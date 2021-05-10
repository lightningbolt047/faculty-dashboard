import SearchBar from '../../components/SearchBar';
import backendService from '../../services/backendService';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useState,useEffect} from 'react';
import StudentPassAccordion from '../../components/StudentPassAccordion';
import Typography from "@material-ui/core/Typography";
import ExploreIcon from "@material-ui/icons/Explore";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HodLeaveApproveAccordion from "../../components/HodLeaveApproveAccordion";

let allPasses = [];

export default function LeaveODApproval({passRoute}){
    const [statusCode,setStatusCode]=useState(0);
    let allShownPasses=[];
    let [shownRegularPasses,setShownRegularPasses]=useState([]);
    let [shownCancelledPasses,setShownCancelledPasses]=useState([]);
    let [shownApprovedPasses,setShownApprovedPasses]=useState([]);

    const [showSearchText,setShowSearchText]=useState('');
    let searchText='';



    const getInfoFromBackend=async ()=>{

        let route;
        if(passRoute==='odform'){
            route='/odform/';
        }else if(passRoute==='hodLeaveApprove'){
            route='/hodLeaveApprove/getAllLeaves';
        }

        let responseBody=await backendService('GET',route,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            allPasses=responseBody;
            getSearchResults();
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
            if(passRoute==='hodLeaveApprove'){
                await getInfoFromBackend();
                return;
            }
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
            else{
                pass=shownCancelledPasses[curPassIndex];
                let tempPassList=[];
                for(const pass of shownCancelledPasses){
                    tempPassList.push(pass);
                }
                tempPassList.splice(curPassIndex,1);
                setShownCancelledPasses(tempPassList);
            }
            if(passRoute==='odform'){
                for(let i=0;i<pass.passDetails.affectedClasses.length;i++){
                    pass.passDetails.affectedClasses[i]=passStatusNewValue;
                }
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
            allPasses=[];
            for(const presentPass of shownRegularPasses){
                allShownPasses.push(presentPass);
                allPasses.push(presentPass);
            }
            for(const presentPass of shownCancelledPasses){
                allShownPasses.push(presentPass);
                allPasses.push(presentPass);
            }
            for(const presentPass of shownApprovedPasses){
                allShownPasses.push(presentPass);
                allPasses.push(presentPass);
            }
        }
    }

    const getSearchResults=()=>{
        let filteredResults=[];
        if(searchText==='' || typeof searchText==='undefined'){
            filteredResults=allPasses;
        }
        else{
            for(const studentDetailIteration of allPasses){
                if(studentDetailIteration.personalDetails.name.toLowerCase().includes(searchText.toLowerCase()) || studentDetailIteration.personalDetails.clgID.toLowerCase().includes(searchText.toLowerCase())){
                    filteredResults.push(studentDetailIteration);
                }
            }
        }
        filteredResults.sort((a,b)=>{
            return parseInt(a.personalDetails.clgID.slice(a.personalDetails.clgID.length-5))-parseInt(b.personalDetails.clgID.slice(b.personalDetails.clgID.length-5))
        });
        allShownPasses=filteredResults;
        if(passRoute==='odform'){
            splitPassesByType();
        } else if(passRoute==='hodLeaveApprove'){
            splitFacultyLeavesByType();
        }
    }

    const splitPassesByType=()=>{
        let regularPassList=[],cancelledPassList=[],approvedPassList=[];
        for(let pass of allShownPasses){
            if(pass.passDetails.affectedClasses.length!==0){
                if(pass.passDetails.affectedClasses[0].approvalStatus==='approved'){
                    approvedPassList.push(pass);
                }
                else if(pass.passDetails.affectedClasses[0].approvalStatus==='pending'){
                    regularPassList.push(pass);
                }
                else if(pass.passDetails.affectedClasses[0].approvalStatus==='cancelled'){
                    cancelledPassList.push(pass);
                }
            }
        }
        setShownRegularPasses(regularPassList);
        setShownCancelledPasses(cancelledPassList);
        setShownApprovedPasses(approvedPassList);
    }

    const splitFacultyLeavesByType=()=>{
        let regularPassList=[],cancelledPassList=[],approvedPassList=[];
        for(let pass of allShownPasses){
            if(pass.passDetails.passStatus==='pending'){
                regularPassList.push(pass);
            }
            else if(pass.passDetails.passStatus==='cancelled'){
                cancelledPassList.push(pass);
            }
            else if(pass.passDetails.passStatus==='approved'){
                approvedPassList.push(pass);
            }
        }
        setShownRegularPasses(regularPassList);
        setShownCancelledPasses(cancelledPassList);
        setShownApprovedPasses(approvedPassList);
    }


    useEffect(()=>{
        getInfoFromBackend()
        //eslint-disable-next-line
    },[]);

    const handleSearchTextChange=(event)=>{
        setShowSearchText(event.target.value);
        searchText=event.target.value;
        getSearchResults();
    }

    const getSegmentTypeNameRegular=()=>{
        if(passRoute==='odform'){
            return "Regular OD Requests";
        }
        return "Pending Leave Approvals";
    }
    const getSegmentTypeNameCancelled=()=>{
        if(passRoute==='odform'){
            return "Cancelled OD Requests";
        }
        return "Cancelled Leaves";
    }
    const getSegmentTypeNameApproved=()=>{
        if(passRoute==='odform'){
            return "Approved OD Requests";
        }
        return "Approved Leaves";
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
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>{getSegmentTypeNameRegular()}</Typography>
                    </div>}
                    {shownRegularPasses.map((studentItem,index)=>(
                        <div>
                            {passRoute==='odform' && <StudentPassAccordion key={index} accordionID={index} passType={'regular'}
                                                                           passJSON={studentItem} handlePassAction={handlePassStatusChange}
                                                                           passRoute='odform'/>}
                            {passRoute==='hodLeaveApprove' && <HodLeaveApproveAccordion key={index} accordionID={index} passType={'regular'}
                                                                               passJSON={studentItem} handlePassAction={handlePassStatusChange}/>}
                        </div>
                    ))}
                    {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentEmergency'}>
                        <Box height={18}/>
                    </div>}
                    {shownCancelledPasses.length!==0 && <div className={'gatePassSegmentCancelled'}>
                        <CancelIcon fontSize={'large'}/>
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>{getSegmentTypeNameCancelled()}</Typography>
                    </div>}
                    {shownCancelledPasses.map((studentItem,index)=>(
                        <div>
                            {passRoute==='odform' && <StudentPassAccordion key={index} accordionID={index} passType={'cancelled'}
                                                                           passJSON={studentItem} handlePassAction={handlePassStatusChange}
                                                                           passRoute='odform'/>}
                            {passRoute==='hodLeaveApprove' && <HodLeaveApproveAccordion key={index} accordionID={index} passType={'cancelled'}
                                                                                        passJSON={studentItem} handlePassAction={handlePassStatusChange}/>}
                        </div>
                    ))}
                    {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                        <Box height={18}/>
                    </div>}
                    {shownApprovedPasses.length!==0 && <div className={'gatePassSegmentRegular'}>
                        <CheckCircleIcon fontSize={'large'}/>
                        <Typography variant={'h4'} id={'gatePassSegmentText'}>{getSegmentTypeNameApproved()}</Typography>
                    </div>}
                    {shownApprovedPasses.map((studentItem,index)=>(
                        <div>
                            {passRoute==='odform' && <StudentPassAccordion key={index} accordionID={index} passType={'approved'}
                                                                           passJSON={studentItem} handlePassAction={handlePassStatusChange}
                                                                           passRoute='odform'/>}
                            {passRoute==='hodLeaveApprove' && <HodLeaveApproveAccordion key={index} accordionID={index} passType={'approved'}
                                                                                        passJSON={studentItem} handlePassAction={handlePassStatusChange}/>}
                        </div>
                    ))}
            </div>
        );
    };



    return (
        <div>
            {statusCode===200 && getAccordionUI()}
            <Box height={12}/>
            {statusCode!==200 && statusCode!==404 && <CircularProgress size={24} color="secondary"/>}
        </div>
    );
}