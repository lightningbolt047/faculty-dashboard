import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditableInput from '../../components/EditableInput';
import {useState,useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import EditableDropdown from '../../components/EditableDropdown';
import globalVariables from '../../services/globalVariables';
import backendQuery from '../../services/backendServices';


export default function Profile(){

    const [phNo,setPhNo]=useState("982-345-1234");
    const [email,setEmail]=useState("abc@email.com");
    const [address,setAddress]=useState("Winter Street");
    const secQsArray = ["Select a security question","When Were You Married?","What Is Your Spouse's Favorite Food?","What Is Your Favorite Visiting Place?","What Course Did You First Offer In College?"];
    const [selectedSecQn,setSelectedSecQn]=useState(secQsArray[0]);
    const [securityAnswer,setSecurityAnswer]=useState("2004");
    const [fetchingData,setFetchingData]=useState(true);
    const [statusCode,setStatusCode]=useState(0);
    const [name,setName]=useState("");
    const [clgID,setClgID]=useState("");
    // const [imagePath,setImagePath]=useState();

    const getInfoFromBackend=async ()=>{
        setFetchingData(true);
        var responseBody=await backendQuery('GET','/profile'+'/'+globalVariables.USER_DB_ID,
            {}
        );
        // if(responseBody.statusCode===404){

        // }
        console.log(responseBody);
        setStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            setPhNo(responseBody.phoneNumber);
            setEmail(responseBody.email);
            setAddress(responseBody.address);
            setSelectedSecQn(responseBody.secQuestion);
            setSecurityAnswer(responseBody.secAnswer);
            setName(responseBody.name);
            setClgID(responseBody.clgID);
        }
        setFetchingData(false);
    };
    //eslint-disable-next-line
    useEffect(()=>{
        getInfoFromBackend();
    },[]);


    const handlePhNoChange=(event)=>{
        setPhNo(event.target.value);
    }
    const handleEmailChange=(event)=>{
        setEmail(event.target.value);
    }
    const handleAddressChange=(event)=>{
        setAddress(event.target.value);
    }
    const handleSecurityQnChange=(event)=>{
        setSelectedSecQn(secQsArray[event.target.value]);
    }
    const handleSecurityAnswerChange=(event)=>{
        setSecurityAnswer(event.target.value);
    }

    const getDefaultQnIndex=()=>{
        if(typeof selectedSecQn==='undefined' || selectedSecQn===""){
            return 0;
        }
        for(var i;i<secQsArray.length;i++){
            if(secQsArray[i]===selectedSecQn){
                return i;
            }
        }
        return 0;
    }
    
    return (
        <div>
            <div className="centerAligningDivs">
                <Avatar src='.../assets/userDefaultProfile.png' className="profilePageProfileAvatar" onClick={()=>console.log("Clicked")}/>
            </div>
            <div>
                <Typography display='block' variant="h5">{name}</Typography>
                <Typography display='block' variant="h6">{clgID}</Typography>
                <Box height={20}/>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldLabel={"Phone Number"} inputSize="small" textValue={phNo} handleValueChange={handlePhNoChange}/>
                    </Grid>
                    <Grid item>
                        <EditableInput fieldLabel={"Email"} inputSize="small" textValue={email} handleValueChange={handleEmailChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldLabel={"Residential Address"} inputSize="small" textValue={address} handleValueChange={handleAddressChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableDropdown fieldLabel={"Security Question"} secQuestions={secQsArray} selectedQn={selectedSecQn} defaultIndex={getDefaultQnIndex()} handleValueChange={handleSecurityQnChange}/>
                    </Grid>
                    <Grid item>
                    <EditableInput fieldLabel={"Security Answer"} inputSize="small" textValue={securityAnswer} handleValueChange={handleSecurityAnswerChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <Button variant='contained' color='secondary'>
                                Change Password
                        </Button>
                    </Grid>
                    
                    <Grid item>
                        <Button variant='contained' color='secondary'>
                            Save
                        </Button>
                    </Grid>
                    <Grid item>
                </Grid>
                </Grid>
           </div>

        </div>
    );
}
