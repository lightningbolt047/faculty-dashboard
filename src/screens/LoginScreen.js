import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import {useEffect, useState} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link,useHistory} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import backendService from '../services/backendService';
import hashString from '../services/hashString';
import { useCookies } from 'react-cookie';
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

  const cookieOptions={
      path:'/',
      maxAge: 3600*24*7
  };



export default function LoginScreen(){
    const [cookies, setCookie, removeCookie] = useCookies(['faculty-dash-auth']);
    const classes=useStyles();
    const [keepSignedIn,setKeepSignedIn]=useState(true);
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [statusCode,setStatusCode]=useState(200);
    const [responseMessage,setResponseMessage]=useState("");
    const [signInWorking,setSignInWorking]=useState(false);
    const [snackbarOpen,setSnackbarOpen]=useState(true);
    let dbID=null;

    sessionStorage.clear();

    const history=useHistory();
    

    const cookieSignInHandler= async()=>{
        if(typeof cookies.dbID==='undefined' || typeof cookies.authToken==='undefined'){
            return;
        }
        setSignInWorking(true);
        let responseBody=await backendService('POST','/auth',
                {
                    loginType:"cookie",
                    dbID:cookies.dbID,
                    authToken:cookies.authToken
                }
            );
            console.log(responseBody.statusCode);
            if(responseBody.statusCode===401){
                if(responseBody.status==="Account locked"){
                    setResponseMessage("Account Locked");
                }else if(responseBody.status==="Wrong Password"){
                    //eslint-disable-next-line
                    setResponseMessage("Wrong Password "+"Remaining Attempts: "+responseBody.remainingAttempts);
                }
            }
            setStatusCode(responseBody.statusCode);
            setSignInWorking(false);
            if(responseBody.statusCode===200){
                dbID=responseBody.dbID;
                sessionStorage.DASHBOARD_SUB_SCREEN_ID=0;
                sessionStorage.USER_AUTH_TOKEN=cookies.authToken;
                sessionStorage.FACULTY_TYPE=responseBody.facultyType;
                sessionStorage.FACULTY_NAME=responseBody.name;
                redirectToHome();
            }
            setResponseMessage(responseBody.status);
            console.log(responseBody);
    }

    const redirectToHome=()=>{
        sessionStorage.USER_DB_ID=dbID;
        history.replace('/dashboard');
    }

    useEffect(()=>{
        cookieSignInHandler();
        sessionStorage.clear();
        //eslint-disable-next-line 
    },[]);

    const signInHandler= async ()=>{
        setSignInWorking(true);
        if((password==='' || typeof password === 'undefined')){
            setStatusCode(1000);
            setResponseMessage('Password Empty');
            if(username==='' || typeof username==='undefined'){
                setResponseMessage('Username and Password Empty');
            }
            setSignInWorking(false);
            return;
        }
        let responseBody=await backendService('POST','/auth',
            {
                loginType:"user",
                clgID:username,
                authToken:hashString(username,password)
            }
        );
        setResponseMessage(responseBody.status);
        setStatusCode(responseBody.statusCode);
        if(responseBody.statusCode===200){
            sessionStorage.USER_AUTH_TOKEN=hashString(username,password);
            sessionStorage.DASHBOARD_SUB_SCREEN_ID=0;
            sessionStorage.FACULTY_TYPE=responseBody.facultyType;
            sessionStorage.FACULTY_NAME=responseBody.name;
            dbID=responseBody.dbID; 
            if(keepSignedIn){
                setCookie('dbID',responseBody.dbID,cookieOptions);
                setCookie('authToken',hashString(username,password),cookieOptions);
            }else{
                removeCookie('dbID');
                removeCookie('authToken');
            }
            redirectToHome();
        }
        else{
            setSnackbarOpen(true);
        }
        setSignInWorking(false);
        console.log(responseBody);
    }


    const errDiv=()=>{
        return (
            <div>
                <Alert variant="filled" severity="error">
                    {statusCode===401 && responseMessage}
                    {statusCode===404 && "No such College ID"}
                    {statusCode===1000 && responseMessage}
                </Alert>
            </div>
        );
    }

    const handleSnackbarClose=(event,reason)=>{
        if (reason!=='clickaway'){
            setSnackbarOpen(false);
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
                        <Grid container className="loginScreenGrid">
                            <Typography variant="h3" className={classes.title} color='secondary'>
                                Login
                            </Typography>
                        </Grid>
                        <Grid container alignContent="center" justify="center">
                            <TextField variant="outlined" color="secondary" value={username} label="Username" onChange ={event => setUsername(event.target.value)}  fullWidth/>
                        </Grid>
                        <Box height={8}/>
                        <Grid container alignContent="center" justify="center">
                            <TextField variant="outlined" color="secondary" value={password} label="Password" onChange={event => setPassword(event.target.value)} onCut={discardCutCopyPaste} onCopy={discardCutCopyPaste} onPaste={discardCutCopyPaste} type='password' fullWidth/>
                        </Grid>
                        <Box height={8}/>
                        <FormControlLabel
                            control={
                            <Checkbox inputProps={{
                                'aria-label':'secondary checkbox'
                            }}/>
                            }
                            checked={keepSignedIn}
                            onChange={()=>{setKeepSignedIn(!keepSignedIn)}}
                            label="Keep me signed in"
                        />
                        <Button variant='contained' color='secondary' onClick={async ()=>signInHandler()}>
                            {!signInWorking && "Sign In"}
                            {signInWorking && <CircularProgress size={24} color="inherit"/>}
                        </Button>
                        
                        <Box height={8}/>
                        <Link to="/recovery">Forgot Password?</Link>
                        <Box height={8}/>
                        <Link to="/authChange">Change Password</Link>
                        <Box height={8}/>
                        {statusCode!==200 && <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
                            {errDiv()}
                            </Snackbar>}
                    </CardContent>
                </Card>
                
            </Grid>
        </div> 
    );
}