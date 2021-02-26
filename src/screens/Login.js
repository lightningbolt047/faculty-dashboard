import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import {useEffect, useState} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import backendQuery from '../services/backendServices';
import hashString from '../services/hashService';
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



export default function LoginScreen(){
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const classes=useStyles();
    const [keepSignedIn,setKeepSignedIn]=useState(true);
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [statusCode,setStatusCode]=useState(200);
    const [responseMessage,setResponseMessage]=useState("");
    

    const cookieSignInHandler= async()=>{
        if(cookies.dbID!=null && cookies.authToken!=null){
            var responseBody=await backendQuery('POST','/auth',
                {
                    loginType:"cookie",
                    dbID:cookies.dbID,
                    authToken:cookies.authToken
                }
            );
            if(responseBody.statusCode===403){
                if(responseBody.status==="Account locked"){
                    setResponseMessage("Account Locked");
                }else if(responseBody.status==="Wrong Password"){
                    //eslint-disable-next-line
                    setResponseMessage("Wrong Password "+"Remaining Attempts: "+responseBody.remainingAttempts);
                }
            }
            setStatusCode(responseBody.statusCode);
            console.log(responseBody);
        }
    }

    useEffect(()=>{
        cookieSignInHandler();
        //eslint-disable-next-line 
    },[]);

    const signInHandler= async ()=>{
        //TODO we will generate token using username and password later
        //Set cookie if keep me signed in is checked

        var responseBody=await backendQuery('POST','/auth',
            {
                loginType:"user",
                clgID:username,
                authToken:hashString(username,password)
            }
        );
        if(responseBody.statusCode===403){
            if(responseBody.status==="Account locked"){
                setResponseMessage("Account Locked");
            }else if(responseBody.status==="Wrong Password"){
                //eslint-disable-next-line
                setResponseMessage("Wrong Password "+"Remaining Attempts: "+responseBody.remainingAttempts);
            }
        }
        setStatusCode(responseBody.statusCode);
        if(statusCode===200){
            if(keepSignedIn){
                setCookie('dbID',responseBody.dbID);
                setCookie('authToken',hashString(username,password));
            }else{
                removeCookie('dbID');
                removeCookie('authToken');
            }
        }
        console.log(responseBody);
    }

    const errDiv=()=>{
        return (
            <div>
                <Alert variant="filled" severity="error">
                    {statusCode===403 && responseMessage}
                    {statusCode===404 && "No such College ID"}
                </Alert>
            </div>
        );
    }


    return (
        <div className="loginScreen">
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                <Card>
                    <CardContent>
                        <Grid container className="loginScreenGrid">
                            <Typography variant="h3" className={classes.title}>
                                Login
                            </Typography>
                        </Grid>
                        <Grid container alignContent="center" justify="center">
                            <TextField variant="outlined" color="secondary" value={username} label="Username" onChange ={event => setUsername(event.target.value)}  fullWidth/>
                        </Grid>
                        <Box height={8}/>
                        <Grid container alignContent="center" justify="center">
                            <TextField variant="outlined" color="secondary" value={password} label="Password" onChange={event => setPassword(event.target.value)} type='password' fullWidth/>
                        </Grid>
                        <Box height={8}/>
                        <FormControlLabel
                            control={
                            <Checkbox inputProps={{
                                'aria-label':'secondary checkbox'
                            }}/>
                            }
                            checked={keepSignedIn}
                            onChange={(e)=>{setKeepSignedIn(!keepSignedIn)}}
                            label="Keep me signed in"
                        />
                        <Button variant='contained' color='secondary' onClick={async ()=>signInHandler()}>Sign In</Button><br></br>
                        <Link to="/recovery">Forgot Password?</Link>
                        <Box height={8}/>
                        {statusCode!==200 && errDiv()}
                    </CardContent>
                </Card>
                
            </Grid>
        </div> 
    );
}