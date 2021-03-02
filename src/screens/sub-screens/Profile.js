import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// const useStyles=makeStyles((theme)=>({
//     profileAvatarLarge: {
//         width: '20px',
//         height:'20px',
//         alignItems:'center'
//     }
// }));

export default function Profile(){
    //const styles=useStyles();
    
    return (
        <div>
            <div className="centerAligningDivs">
                <Avatar src='.../assets/userDefaultProfile.png' className="profilePageProfileAvatar" onClick={()=>console.log("Clicked")}/>
            </div>
            <div>
                <Typography display='block' variant="subtitle1">Eswar</Typography>
                <Typography display='block' variant="subtitle2">CB.EN.U4CSE18318</Typography>
           </div>

        </div>
    );
}
