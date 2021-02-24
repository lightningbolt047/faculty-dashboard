import { Button, CardContent, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import {useState} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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



export default function LoginScreen(){
    const classes=useStyles();
    const [keepSignedIn,setKeepSignedIn]=useState(true);
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const signInHandler= async ()=>{
        //TODO we will generate token using username and password later
        var responseBody=await backendQuery('POST','/auth',
            {
                clgID:username,
                token:password
            }
        );
        console.log(responseBody);
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
                    </CardContent>
                </Card>
                
            </Grid>
        </div> 
    );
}