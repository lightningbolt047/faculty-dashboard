import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import hashString from '../services/hashService';
import Alert from '@material-ui/lab/Alert';
import backendQuery from '../services/backendServices';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useCookies } from 'react-cookie';
const useStyles=makeStyles({
    title:{
      flexGrow:1,
      textAlign:'center',
    },
    Grid:{
        padding:'100px'
    },
  });

  var dbID=sessionStorage.USER_DB_ID;



export default function ChangePasswordScreen(){
    const classes=useStyles();
    const history = useHistory();
    // eslint-disable-next-line
    const [cookies, setCookie, removeCookie] = useCookies(['faculty-dash-auth']);

    var [username,setUsername]=useState("");
    const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmNewPassword,setConfirmNewPassword] = useState("");
    const [statusCode,setStatusCode]=useState(200);
    const [userPresent,setUserPresent]=useState(false);
    const [passwordChangeSuccess,setPasswordChangeSuccess]=useState(false);
    const [buttonWorking,setButtonWorking]=useState(false);
    const [alreadyLoggedIn,setAlreadyLoggedIn]=useState(false);

    const checkUserPresence=async ()=>{
        setButtonWorking(true);

        var responseBody=await backendQuery('POST','/recovery',
            {
                reqType:"userPresenceCheck",
                clgID:username
            }
        );
        setStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            setUserPresent(true);
        }
        dbID=responseBody.dbID;
        setButtonWorking(false);
        console.log(responseBody);
    }

    useEffect(()=>{
        if(typeof sessionStorage.USER_DB_ID!=='undefined'){
            setStatusCode(200);
            dbID=sessionStorage.USER_DB_ID;
            setUserPresent(true);
            setAlreadyLoggedIn(true);
            return;
        }
    },[]);

    const checkOldPasswordChangePassword=async ()=>{
        console.log(sessionStorage.USER_DB_ID);

        if(newPassword!==confirmNewPassword || newPassword===""){   
            return;
        }
        setButtonWorking(true);

        if(typeof sessionStorage.USER_DB_ID!=='undefined'){
            var usernameResponse=await backendQuery('GET',`/profile/getClgIDOnly/`,
                {},sessionStorage.USER_AUTH_TOKEN,sessionStorage.USER_DB_ID
            );
            username=usernameResponse.clgID;
        }

        var responseBody=await backendQuery('POST',`/profile/`,
            {
                updateType:"authTokenChange",
                authToken:hashString(username,newPassword)
            },hashString(username,oldPassword),typeof sessionStorage.USER_DB_ID==='undefined' || sessionStorage.USER_DB_ID!==dbID?dbID:sessionStorage.USER_DB_ID
        );
        if(responseBody.statusCode===200){
            removeCookie('dbID');
            removeCookie('authToken');
            sessionStorage.clear();
            setPasswordChangeSuccess(true);
        }
        setStatusCode(responseBody.statusCode);
        setButtonWorking(false);
        
        console.log(responseBody);
    }


    const changePasswordRequestForm=()=>{
        return (
            <div>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={oldPassword} label="Old Password" onChange={event => {if(!passwordChangeSuccess){setOldPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={newPassword} label="New Password" onChange={event => {if(!passwordChangeSuccess){setNewPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={confirmNewPassword} label="Confirm New Password" onChange={event => {if(!passwordChangeSuccess){setConfirmNewPassword(event.target.value)}}} type='password' fullWidth/>
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
                {userPresent && statusCode===401 && "Wrong Security Answer. Password not changed"}
            </Alert>
        </div>
        );
    }

    const passwordMatchErrDiv=()=>{
        return(
        <div>
            <Alert variant="filled" severity="warning">
                {newPassword==="" && "Password fields blank"}
                {newPassword!==confirmNewPassword && "Password fields do not match"}
                {userPresent && statusCode===401 && "Wrong old password"}
            </Alert>
        </div>
        );
    }

    var timeoutObject;

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
                    Password change success. You will be redirected to login screen soon!
                </Alert>
            </div>
        );
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
                                <TextField variant="outlined" color="secondary" value={username} label="College ID" onChange ={event => {if(!userPresent){setUsername(event.target.value)}}}  fullWidth/>
                            </Grid>
                            <Box height={8}/>
                        </div>}
                        {userPresent && changePasswordRequestForm()}

                        <Button variant='contained' color='secondary' onClick={async ()=>{
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
                                return;
                            }
                        }}>
                            {!buttonWorking && !userPresent && "Next"}
                            {!buttonWorking && userPresent && !passwordChangeSuccess && "Set new password"}
                            {!buttonWorking && userPresent && passwordChangeSuccess && "Go back"}
                            {buttonWorking && <CircularProgress size={24} color="inherit"/>}

                        </Button><br></br>
                        <Box height={8}/>
                        {statusCode!==200 && reqErrDiv()}
                        {userPresent && (newPassword!==confirmNewPassword || newPassword==="") && passwordMatchErrDiv()}
                        {passwordChangeSuccess && passwordChangeSuccessDiv()}
                    </CardContent>
                </Card>
            </Grid>
        </div> 
    );
}