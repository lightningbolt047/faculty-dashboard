import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import hashString from '../services/hashString';
import Alert from '@material-ui/lab/Alert';
import backendService from '../services/backendService';
import CircularProgress from '@material-ui/core/CircularProgress';
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



export default function ForgotPasswordScreen(){
    const classes=useStyles();
    const history = useHistory()

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [secQuestion,setSecQuestion]=useState("");
    const [secAnswer,setSecAnswer]=useState("");
    const [dbID,setDbID]=useState("");
    const [statusCode,setStatusCode]=useState(200);
    const [userPresent,setUserPresent]=useState(false);
    const [passwordChangeSuccess,setPasswordChangeSuccess]=useState(false);
    const [buttonWorking,setButtonWorking]=useState(false);
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
            setDbID(responseBody.dbID);
            setSecQuestion(responseBody.secQuestion);
            setUserPresent(true);
            setOpenSnackbar(false);
        }else{
            setOpenSnackbar(true);
        }
        setButtonWorking(false);
        console.log(responseBody);
    }

    const checkSecAnswerChangePassword=async ()=>{

        if(password!==confirmPassword || password===""){
            setOpenSnackbar(true);  
            return;
        }
        setButtonWorking(true);

        let responseBody=await backendService('POST','/recovery',
            {
                reqType:"secAnswerChangePassword",
                dbID:dbID,
                secAnswer:secAnswer,
                authToken:hashString(username,password)
            }
        );
        if(responseBody.statusCode===200){
            setPasswordChangeSuccess(true);
        }
        setStatusCode(responseBody.statusCode);
        setButtonWorking(false);
        setOpenSnackbar(true);
        
        console.log(responseBody);
    }

    const getNoSecurityQuestionDiv=()=>{
        return (
            <div>
                <Alert variant="filled" severity="info">
                    Sorry! No Security question was set for this account. Contact admin for account recovery
                </Alert>
                <Box height={8}/>
            </div>
        );
    }

    const getRecoveryPasswordForm=()=>{
        return (
            <div className="getSecQuestion">
                <p id="secQuestion">{"Security Question: "+secQuestion}</p>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"forgotPasswordSecAnswer"} variant="outlined" color="secondary" value={secAnswer} label="Security Answer" onChange={event => {if(!passwordChangeSuccess){setSecAnswer(event.target.value)}}} fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"forgotPasswordPassword"} variant="outlined" color="secondary" value={password} label="Password" onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} onChange={event => {if(!passwordChangeSuccess){setPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField id={"forgotPasswordNewPassword"} variant="outlined" color="secondary" value={confirmPassword} label="Confirm Password" onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} onChange={event => {if(!passwordChangeSuccess){setConfirmPassword(event.target.value)}}} type='password' fullWidth/>
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
                {password==="" && "Password fields blank"}
                {password!==confirmPassword && "Password fields do not match"}
            </Alert>
        </div>
        );
    }

    let timeoutObject;

    const sendUserBackToLogin=async ()=>{
        timeoutObject=setTimeout(()=>{
            history.replace('/');
        },1000);

        return ()=>clearTimeout(timeoutObject);
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

    const getSnackbarContent=()=>{
        if(statusCode!==200){
            return reqErrDiv();
        }
        if(userPresent && secQuestion!=null && (password!==confirmPassword || password==="")){
            return passwordMatchErrDiv();
        }
        if(passwordChangeSuccess){
            return passwordChangeSuccessDiv()
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
                                Forgot Password?
                            </Typography>
                        </Grid>
                        <div className="getUser">
                            <Grid container alignContent="center" justify="center">
                                <TextField id={"forgotPasswordClgID"} variant="outlined" color="secondary" value={username} label="College ID" onChange ={event => {if(!userPresent){setUsername(event.target.value)}}}  fullWidth/>
                            </Grid>
                            <Box height={8}/>
                        </div>
                        {userPresent && secQuestion==null && getNoSecurityQuestionDiv()}
                        {userPresent && secQuestion!=null && getRecoveryPasswordForm()}

                        <Button variant='contained' color='secondary' onClick={async ()=>{
                            if(!userPresent){
                                checkUserPresence();
                                return;
                            }
                            if(userPresent && secQuestion!=null){
                                checkSecAnswerChangePassword();
                                return;
                            }
                            if(userPresent && secQuestion==null){
                                history.goBack();
                            }
                        }}>
                            {!buttonWorking && !userPresent && "Next"}
                            {!buttonWorking && userPresent && secQuestion!=null && !passwordChangeSuccess && "Set new password"}
                            {!buttonWorking && passwordChangeSuccess && "Go back"}
                            {buttonWorking && <CircularProgress size={24} color="inherit"/>}

                        </Button>
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