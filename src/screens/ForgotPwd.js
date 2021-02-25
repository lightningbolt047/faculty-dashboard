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
    const [secAnswer,setSecAnswer]=useState("");


    // const signInHandler= async ()=>{
    //     //TODO we will generate token using username and password later
    //     //Set cookie if keep me signed in is checked
    //     var responseBody=await backendQuery('POST','/auth',
    //         {
    //             clgID:username,
    //             token:password
    //         }
    //     );
    //     console.log(responseBody);
    // }


    return (
        <div className="loginScreen">
            <Grid container justify="center" alignItems="center" direction="column" style={{minHeight: "100vh"}}>
                <Card>
                    <CardContent>
                        <Grid container className="loginScreenGrid">
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

                        <div className="getSecQuestion">
                            <p>This Is Placeholder For Security Qs</p>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" value={secAnswer} label="SecAnswer" onChange={event => setSecAnswer(event.target.value)} fullWidth/>
                            </Grid>
                            <Box height={8}/>
                            <Grid container alignContent="center" justify="center">
                                <TextField variant="outlined" color="secondary" value={password} label="password" onChange={event => setPassword(event.target.value)} type='password' fullWidth/>
                            </Grid>
                            <Box height={8}/>
                        </div>


                        <Button variant='contained' color='secondary'>Set New Password</Button><br></br>
                        <Box height={8}/>
                    </CardContent>
                </Card>
                
            </Grid>
        </div> 
    );
}