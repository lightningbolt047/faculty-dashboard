import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import hashString from '../services/hashService';
import Alert from '@material-ui/lab/Alert';
import backendQuery from '../services/backendServices';

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

    const checkUserPresence=async ()=>{

        var responseBody=await backendQuery('POST','/recovery',
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
        }
        console.log(responseBody);
    }

    const checkSecAnswerChangePassword=async ()=>{

        if(password!==confirmPassword || password===""){   
            return;
        }

        var responseBody=await backendQuery('POST','/recovery',
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
                    <TextField variant="outlined" color="secondary" value={secAnswer} label="Security Answer" onChange={event => {if(!passwordChangeSuccess){setSecAnswer(event.target.value)}}} fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={password} label="Password" onChange={event => {if(!passwordChangeSuccess){setPassword(event.target.value)}}} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={confirmPassword} label="Confirm Password" onChange={event => {if(!passwordChangeSuccess){setConfirmPassword(event.target.value)}}} type='password' fullWidth/>
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
                {userPresent && statusCode===403 && "Wrong Security Answer. Password not changed"}
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

    const sendUserBackToLogin=async ()=>{
        setTimeout(()=>{
            history.goBack();
        },5000);
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
                            <Typography variant="h4" className={classes.title}>
                                Forgot Password?
                            </Typography>
                        </Grid>
                        <div className="getUser">
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" value={username} label="College ID" onChange ={event => {if(!userPresent){setUsername(event.target.value)}}}  fullWidth/>
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
                        }}>{!userPresent && "Next"}{userPresent && secQuestion!=null && "Set new password"}{userPresent && secQuestion==null && "Go back"}</Button><br></br>
                        <Box height={8}/>
                        {statusCode!==200 && reqErrDiv()}
                        {userPresent && secQuestion!=null && (password!==confirmPassword || password==="") && passwordMatchErrDiv()}
                        {passwordChangeSuccess && passwordChangeSuccessDiv()}
                    </CardContent>
                </Card>
            </Grid>
        </div> 
    );
}