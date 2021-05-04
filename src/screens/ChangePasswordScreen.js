import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import hashString from '../services/hashString';
import Alert from '@material-ui/lab/Alert';
import backendService from '../services/backendService';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useCookies } from 'react-cookie';
import Snackbar from '@material-ui/core/Snackbar';
const useStyles=makeStyles({
    title:{
      flexGrow:1,
      textAlign:'center',
    },
    Grid:{
        padding:'100px'
    },
  });

  let dbID;



export default function ChangePasswordScreen(){
    const classes=useStyles();
    const history = useHistory();
    // eslint-disable-next-line
    const removeCookie = useCookies(['faculty-dash-auth'])[2];

    let [username,setUsername]=useState("");
    const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmNewPassword,setConfirmNewPassword] = useState("");
    const [statusCode,setStatusCode]=useState(200);
    const [userPresent,setUserPresent]=useState(false);
    const [passwordChangeSuccess,setPasswordChangeSuccess]=useState(false);
    const [buttonWorking,setButtonWorking]=useState(false);
    const [alreadyLoggedIn,setAlreadyLoggedIn]=useState(false);
    const [openSnackbar,setOpenSnackbar]=useState(false);

    const checkUserPresence=async ()=>{
        setButtonWorking(true);

        let responseBody=await backendService('POST','/recovery',
            {
                reqType:"userPresenceCheck",
                clgID:username
            }
        );
        setStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            setUserPresent(true);
            setOpenSnackbar(false);
        }else{
            setOpenSnackbar(true);
        }
        dbID=responseBody.dbID;
        setButtonWorking(false);
    }

    useEffect(()=>{
        if(typeof sessionStorage.USER_DB_ID!=='undefined'){
            setStatusCode(200);
            dbID=sessionStorage.USER_DB_ID;
            setUserPresent(true);
            setAlreadyLoggedIn(true);
        }
    },[]);

    const checkOldPasswordChangePassword=async ()=>{

        if(newPassword!==confirmNewPassword || newPassword===""){
            setOpenSnackbar(true);
            return;
        }
        setButtonWorking(true);

        if(typeof sessionStorage.USER_DB_ID!=='undefined'){
            let usernameResponse=await backendService('GET',`/profile/getClgIDOnly/`,
                {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
            );
            username=usernameResponse.clgID;
        }

        let responseBody=await backendService('POST',`/profile/`,
            {
                updateType:"authTokenChange",
                authToken:hashString(username,newPassword)
            },hashString(username,oldPassword),dbID
        );
        if(responseBody.statusCode===200){
            removeCookie('dbID');
            removeCookie('authToken');
            sessionStorage.clear();
            setPasswordChangeSuccess(true);
        }
        setStatusCode(responseBody.statusCode);
        setButtonWorking(false);
        setOpenSnackbar(true);
    }


    const changePasswordRequestForm=()=>{
        return (
            <div>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"changePasswordOldPassword"} variant="outlined" color="secondary" value={oldPassword} label="Old Password" onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} onChange={event => {if(!passwordChangeSuccess){setOldPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"changePasswordNewPassword"} variant="outlined" color="secondary" value={newPassword} label="New Password" onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} onChange={event => {if(!passwordChangeSuccess){setNewPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"changePasswordConfirmNewPassword"} variant="outlined" color="secondary" value={confirmNewPassword} label="Confirm New Password" onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} onChange={event => {if(!passwordChangeSuccess){setConfirmNewPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
            </div>
        );
    }

    const reqErrDiv=()=>{
        return (
        <div>
            <Alert variant="filled" severity="error">
                {!userPresent && statusCode===404 && "No such College ID"}
            </Alert>
        </div>
        );
    }

    const passwordMatchErrDiv=()=>{
        return(
        <div>
            <Alert variant="filled" severity="warning">
                {((newPassword!==confirmNewPassword || newPassword==='') || (userPresent && (statusCode===401 || oldPassword!==''))) && "Invalid/Wrong Password Field inputs"}
            </Alert>
        </div>
        );
    }

    let timeoutObject;

    const sendUserBackToLogin=async ()=>{
        timeoutObject=setTimeout(()=>{
            history.replace('/');
        },1000);
        return ()=>clearTimeout(timeoutObject)
    }

    const passwordChangeSuccessDiv=()=>{
        sendUserBackToLogin();
        return (
            <div>
                <Alert variant="filled" severity="success">
                    Password change success. You will soon be redirected to login screen!
                </Alert>
            </div>
        );
    }

    const getSnackbarContent=()=>{
        if(!userPresent && statusCode===404){
            return reqErrDiv();
        }
        if(userPresent && ((newPassword!==confirmNewPassword || newPassword==="") || statusCode===401)){
            return passwordMatchErrDiv();
        }
        if(passwordChangeSuccess){
            return passwordChangeSuccessDiv();
        }
    }

    const handleSnackbarClose=(event,reason)=>{
        if (reason!=='clickaway'){
            setOpenSnackbar(false);
        }
    }

    const discardCutCopyPaste=(event)=>{
        event.preventDefault();
    }

    
    return (
        <div className="loginScreen">
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                <Card>
                    <CardContent>
                        <Grid container className="forgotPasswordScreenGrid">
                            <Typography variant="h4" className={classes.title} color='secondary'>
                                Change Password
                            </Typography>
                        </Grid>
                        {!alreadyLoggedIn && <div className="getUser">
                            <Grid container alignContent="center" justify="center">
                                <TextField id={"changePasswordClgID"} variant="outlined" color="secondary" value={username} label="College ID" onChange ={event => {if(!userPresent){setUsername(event.target.value)}}}  fullWidth/>
                            </Grid>
                            <Box height={8}/>
                        </div>}
                        {userPresent && changePasswordRequestForm()}

                        <Button id={"changePasswordSubmitButton"} variant='contained' color='secondary' onClick={async ()=>{
                            if(!userPresent){
                                checkUserPresence();
                                return;
                            }
                            if(userPresent && passwordChangeSuccess){
                                history.replace('/');
                                return;
                            }
                            if(userPresent){
                                checkOldPasswordChangePassword();
                            }
                        }}>
                            {!buttonWorking && !userPresent && "Next"}
                            {!buttonWorking && userPresent && !passwordChangeSuccess && "Set new password"}
                            {!buttonWorking && userPresent && passwordChangeSuccess && "Go back"}
                            {buttonWorking && <CircularProgress size={24} color="inherit"/>}

                        </Button><br></br>
                        <Box height={8}/>
                    </CardContent>
                </Card>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                {getSnackbarContent()}
            </Snackbar>
        </div> 
    );
}