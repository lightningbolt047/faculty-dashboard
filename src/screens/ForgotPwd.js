import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import {useState} from 'react';
import {Link} from 'react-router-dom';

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
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [secQuestion,setSecQuestion]=useState("");
    const [secAnswer,setSecAnswer]=useState("");
    const [dbID,setDbID]=useState("");
    const [statusCode,setStatusCode]=useState(0);

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
        }
        console.log(responseBody);
    }

    const getRecoveryPasswordForm=()=>{
        return (
            <div className="getSecQuestion">
                <p id="secQuestion">{"Security Question: "+secQuestion}</p>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={secAnswer} label="Security Answer" onChange={event => setSecAnswer(event.target.value)} fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={password} label="Password" onChange={event => setPassword(event.target.value)} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
                <Grid container alignContent="center" justify="center">
                    <TextField variant="outlined" color="secondary" value={password} label="Confirm Password" onChange={event => setConfirmPassword(event.target.value)} type='password' fullWidth/>
                </Grid>
                <Box height={8}/>
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
                                <TextField variant="outlined" color="secondary" value={username} label="Username" onChange ={event => setUsername(event.target.value)}  fullWidth/>
                            </Grid>
                            <Box height={8}/>
                        </div>
                        {statusCode==200 && getRecoveryPasswordForm()}

                        <Button variant='contained' color='secondary' onClick={async ()=>checkUserPresence()}>Set New Password</Button><br></br>
                        <Box height={8}/>
                    </CardContent>
                </Card>
                
            </Grid>
        </div> 
    );
}