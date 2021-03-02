import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import EditableInput from '../../components/EditableInput';
import {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';


export default function Profile(){

    const [phNo,setPhNo]=useState("982323232");
    const [email,setEmail]=useState("sdsu@email.com");
    const [address,setAddress]=useState("9, 9th Ave");


    const handlePhNoChange=(event)=>{
        setPhNo(event.target.value);
    }
    const handleEmailChange=(event)=>{
        setEmail(event.target.value);
    }
    const handleAddressChange=(event)=>{
        setAddress(event.target.value);
    }
    
    return (
        <div>
            <div className="centerAligningDivs">
                <Avatar src='.../assets/userDefaultProfile.png' className="profilePageProfileAvatar" onClick={()=>console.log("Clicked")}/>
            </div>
            <div>
                <Typography display='block' variant="h5">Eswar</Typography>
                <Typography display='block' variant="h6">CB.EN.U4CSE18318</Typography>
                <Box height={20}/>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldLabel={"Phone Number"} inputSize="small" textValue={phNo} handleValueChange={handlePhNoChange}/>
                    </Grid>
                    <Grid item>
                        <EditableInput fieldLabel={"Email"} inputSize="small" textValue={email} handleValueChange={handleEmailChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <EditableInput fieldLabel={"Residential Address"} inputSize="small" textValue={address} handleValueChange={handleAddressChange}/>
                    </Grid>
                </Grid>
                <Grid container spacing={3} alignContent="center" justify="center">
                    <Grid item>
                        <Button variant='contained' color='secondary'>
                                Change Password
                        </Button>
                    </Grid>
                    
                    <Grid item>
                        <Button variant='contained' color='secondary'>
                            Save
                        </Button>
                    </Grid>
                    <Grid item>
                </Grid>
                </Grid>
           </div>

        </div>
    );
}
