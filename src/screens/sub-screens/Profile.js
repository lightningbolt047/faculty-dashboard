import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditableInput from '../../components/EditableInput';
import {useState,useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import globalVariables from '../../services/globalVariables';
import backendQuery from '../../services/backendServices';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';


export default function Profile(){

    const [phNo,setPhNo]=useState("982-345-1234");
    const [email,setEmail]=useState("abc@email.com");
    const [address,setAddress]=useState("Winter Street");
    const [securityQuestion,setSecQn]=useState("");
    const [securityAnswer,setSecurityAnswer]=useState("2004");
    const [fetchingData,setFetchingData]=useState(true);
    const [statusCode,setStatusCode]=useState(0);
    const [name,setName]=useState("");
    const [clgID,setClgID]=useState("");
    const [sendingData,setSendingData]=useState(false);
    const [profileUpdateStatus,setProfileUpdateStatus]=useState(-1);
    const history=useHistory();

    const [imagePath,setImagePath]=useState();

    const getInfoFromBackend=async ()=>{
        setFetchingData(true);
        var responseBody=await backendQuery('GET',`/profile/${globalVariables.USER_DB_ID}`,
            {},globalVariables.USER_AUTH_TOKEN
        );
        // if(responseBody.statusCode===404){

        // }
        setStatusCode(responseBody.statusCode);
        console.log(responseBody);
        if(responseBody.statusCode===200){
            setPhNo(responseBody.phoneNumber);
            setEmail(responseBody.email);
            setAddress(responseBody.address);
            setSecQn(responseBody.secQuestion);
            setSecurityAnswer(responseBody.secAnswer);
            setName(responseBody.name);
            setClgID(responseBody.clgID);
            setImagePath(responseBody.imagePath);
        }
        setFetchingData(false);
    };
    //eslint-disable-next-line
    useEffect(()=>{
        getInfoFromBackend();
    },[]);

    const postInfoToBackend=async ()=>{
        setSendingData(true);
        var responseBody=await backendQuery('POST',`/profile/${globalVariables.USER_DB_ID}`,
            {
                updateType:'personalInfoUpdate',
                phoneNumber:phNo,
                address:address,
                email:email,
                secQuestion:securityQuestion,
                secAnswer:securityAnswer,
                imagePath:imagePath
            },globalVariables.USER_AUTH_TOKEN
        );
        // if(responseBody.statusCode===404){

        // }
        setProfileUpdateStatus(responseBody.statusCode);
        console.log(responseBody);
        setSendingData(false);
    }


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
        setSecQn(event.target.value);
    }
    const handleSecurityAnswerChange=(event)=>{
        setSecurityAnswer(event.target.value);
    }

    const getLoadingUI=()=>{
        return (
            <div className="centerScreenProgressbar">
                <CircularProgress size={32} color="secondary"/>
            </div>
        );
    }
    
    return (
        <div>
            {fetchingData && getLoadingUI()}
            {!fetchingData && <div className="centerAligningDivs">
                <Avatar src='.../assets/userDefaultProfile.png' className="profilePageProfileAvatar" onClick={()=>console.log("Clicked")}/>
            </div>}
            {!fetchingData && <div>
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
                        <EditableInput fieldLabel={"Security Question"} inputSize="small" textValue={securityQuestion} handleValueChange={handleSecurityQnChange}/>
                    </Grid>
                    <Grid item>
                        <EditableInput fieldLabel={"Security Answer"} inputSize="small" textValue={securityAnswer} handleValueChange={handleSecurityAnswerChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <Button variant='contained' color='secondary' onClick={()=>history.replace('/authChange')}>
                                Change Password
                        </Button>
                    </Grid>
                    
                    <Grid item>
                        <Button variant='contained' color='secondary' onClick={postInfoToBackend}>
                            {sendingData && <CircularProgress size={24} color="inherit"/>}
                            {!sendingData && "Save"}
                        </Button>
                    </Grid>
                    <Box height={8}/>
                    <Grid container spacing={3} alignContent="center" justify="center">
                        <Grid item>
                            {profileUpdateStatus===200 &&
                            <Alert variant="filled" severity="success">
                                {"Successfully updated"}
                            </Alert>
                            }
                            {(profileUpdateStatus!==200 && profileUpdateStatus!==-1) &&
                            <Alert variant="filled" severity="error">
                                {`Something went wrong: Error ${profileUpdateStatus}`}
                            </Alert>
                            }
                        </Grid>
                    </Grid>
                </Grid>
           </div>
           }
        </div>
    );
}
