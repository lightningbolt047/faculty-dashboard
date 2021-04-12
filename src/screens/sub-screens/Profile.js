import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditableInput from '../../components/EditableInput';
import {useState,useEffect,useRef} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import backendService from '../../services/backendService';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

let buttonEnabledList=[true,true,true,true,true];
export default function Profile(){

    const [phNo,setPhNo]=useState("982-345-1234");
    const [email,setEmail]=useState("abc@email.com");
    const [address,setAddress]=useState("Winter Street");
    const [securityQuestion,setSecQn]=useState("");
    const [securityAnswer,setSecurityAnswer]=useState("2004");
    const [fetchingData,setFetchingData]=useState(true);
    const [name,setName]=useState("");
    const [clgID,setClgID]=useState("");
    const [department,setDepartment]=useState("");
    const [sendingData,setSendingData]=useState(false);
    const [profileUpdateStatus,setProfileUpdateStatus]=useState(-1);
    const [enableSaveButton,setEnableSaveButton]=useState(true);
    const [alertVisible,setAlertVisible]=useState(false);
    const history=useHistory();
    let imageUploadSuccess=false;

    let uploadImageFile=useRef(null);

    const [imagePath,setImagePath]=useState('');

    const getInfoFromBackend=async ()=>{
        setFetchingData(true);
        let responseBody=await backendService('GET',`/profile/getFullProfile/`,
            {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            setPhNo(responseBody.phoneNumber);
            setEmail(responseBody.email);
            setAddress(responseBody.address);
            setSecQn(responseBody.secQuestion);
            setSecurityAnswer(responseBody.secAnswer);
            setName(responseBody.name);
            setClgID(responseBody.clgID);
            setImagePath(responseBody.imagePath);
            setDepartment(responseBody.department);
        }
        setFetchingData(false);
    };
    useEffect(()=>{
        getInfoFromBackend();
    },[]);

    const postInfoToBackend=async ()=>{

        if(phNo==='' || email==='' || address==='' || securityQuestion==='' || securityAnswer==='' || email.split('@').length!==2){
            setProfileUpdateStatus(1000);
            setAlertVisible(true);
            setTimeout(async ()=>{
                await getInfoFromBackend();
                setProfileUpdateStatus(-1);
                setAlertVisible(true);
            },2000);
            return;
        }

        setSendingData(true);
        let responseBody=await backendService('POST',`/profile/`,
            {
                updateType:'personalInfoUpdate',
                phoneNumber:phNo,
                address:address,
                email:email,
                secQuestion:securityQuestion,
                secAnswer:securityAnswer,
                imagePath:imagePath
            },sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
        );
        setProfileUpdateStatus(responseBody.statusCode);
        setSendingData(false);
        setAlertVisible(true);
        setTimeout(()=>{
            setAlertVisible(false);
        },5000);
    }

    const handleEnableSaveButton=(index,value)=>{
        let count=0;
        buttonEnabledList[index]=value;
        for(let buttonEnabled of buttonEnabledList){
            if(buttonEnabled){
                count++;
            }
        }
        if(count===buttonEnabledList.length){
            setEnableSaveButton(true);
        }
        else{
            setEnableSaveButton(false);
        }
    }

    const handlePhNoChange=(event)=>{
        let result=parseInt(event.target.value)
        
        if(event.target.value==='' || (!isNaN(result) && result.toString().length===event.target.value.length)){
            setPhNo(event.target.value);
        }
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
    const handleFileSelection=(event)=>{
        if(!imageUploadSuccess){
            uploadImageFile=event.target.files[0];
            handleSendImage();
        }
    }
    const handleSendImage=()=>{

        if(uploadImageFile==null){
            return;
        }

        const formData = new FormData();

        formData.append('imageFile',uploadImageFile);

        axios({
            url:`http://localhost:4000/profile/uploadimg/`,
            method:'POST',
            headers:{
                authtoken:sessionStorage.USER_AUTH_TOKEN,
                dbid:sessionStorage.USER_DB_ID
            },
            data: formData
        })
        .then(()=>{
            window.location.reload();
        });
    }

    const getImagePath=()=>{
        if(typeof imagePath==='undefined' || imagePath===''){
            return '.../assets/userDefaultProfile.png';
        }
        return `http://localhost:4000/images/${sessionStorage.USER_DB_ID}/`;
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
                <input style={{display:'none'}} accept=".jpg,.jpeg,.png" type='file' ref={uploadImageFile} onChange={(e)=>handleFileSelection(e)}/>
                <Box flex={1}>
                    <Avatar src={getImagePath()} style={{width:'120px',height:'120px'}} onClick={()=>{if(!imageUploadSuccess){
                        uploadImageFile.current.click()
                    }}}/>
                </Box>
            </div>}
            {!fetchingData && <div>
                <Typography display='block' variant="h5">{name}</Typography>
                <Typography display='block' variant="h6">{clgID}</Typography>
                <Typography display='block' variant="h6">{department}</Typography>
                <Box height={20}/>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldID={"profilePhoneNumber"} fieldButtonID={"profilePhoneNumberButton"} fieldLabel={"Phone Number"} inputSize="small" textValue={phNo} handleValueChange={handlePhNoChange} handleSaveButtonStatus={handleEnableSaveButton} fieldIndex={0}/>
                    </Grid>
                    <Grid item>
                        <EditableInput fieldID={"profileEmail"} fieldButtonID={"profileEmailButton"} fieldLabel={"Email"} inputSize="small" textValue={email} handleValueChange={handleEmailChange} handleSaveButtonStatus={handleEnableSaveButton} fieldIndex={1}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldID={"profileAddress"} fieldButtonID={"profileAddressButton"} fieldLabel={"Residential Address"} inputSize="small" textValue={address} handleValueChange={handleAddressChange} handleSaveButtonStatus={handleEnableSaveButton} fieldIndex={2}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldID={"profileSecQuestion"} fieldButtonID={"profileSecQuestionButton"} fieldLabel={"Security Question"} inputSize="small" textValue={securityQuestion} handleValueChange={handleSecurityQnChange} handleSaveButtonStatus={handleEnableSaveButton} fieldIndex={3}/>
                    </Grid>
                    <Grid item>
                        <EditableInput fieldID={"profileSecAnswer"} fieldButtonID={"profileSecAnswerButton"} fieldLabel={"Security Answer"} inputSize="small" textValue={securityAnswer} handleValueChange={handleSecurityAnswerChange} handleSaveButtonStatus={handleEnableSaveButton} fieldIndex={4}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <Button id='profileChangePasswordBtn' variant='contained' color='secondary' onClick={()=>history.push('/authChange')}>
                                Change Password
                        </Button>
                    </Grid>
                    
                    <Grid item>
                        <Button id="profileSavebtn" variant='contained' color='secondary' disabled={!enableSaveButton} onClick={postInfoToBackend}>
                            {sendingData && <CircularProgress size={24} color="inherit"/>}
                            {!sendingData && "Save"}
                        </Button>
                    </Grid>
                    <Box height={8}/>
                    <Grid container spacing={3} alignContent="center" justify="center">
                        <Grid item>
                            {profileUpdateStatus===200 && alertVisible &&
                            <Alert variant="filled" severity="success">
                                {"Successfully updated"}
                            </Alert>
                            }
                            {(profileUpdateStatus!==200 && alertVisible && profileUpdateStatus!==-1 && profileUpdateStatus!==1000) &&
                            <Alert variant="filled" severity="error">
                                {`Something went wrong: Error ${profileUpdateStatus}`}
                            </Alert>
                            }
                            {profileUpdateStatus===1000 && alertVisible &&
                            <Alert variant="filled" severity="warning">
                                Enter Proper details
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
