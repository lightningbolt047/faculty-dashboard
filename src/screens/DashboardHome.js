import { Box, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import {useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function DashboardHome(){

    // eslint-disable-next-line
    const [cookies, setCookie, removeCookie] = useCookies(['faculty-dash-auth']);
    const history=useHistory();


    const logoutRoutine=()=>{
        removeCookie("dbID");
        removeCookie("authToken");
        history.replace('/');
    }

    return (
        <div>
            <AppBar className="dashboardHomeAppBar" position="static">
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <IconButton edge="start" color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <h2>Home</h2>
                    </Box>
                    <IconButton color="inherit" className="dashboardHomeAccountCircle" onClick={()=>console.log("Hello")}>
                        <AccountCircleIcon/>
                    </IconButton>
                    <IconButton color="inherit" className="dashboardHomeAccountCircle" onClick={logoutRoutine}>
                        <LogoutIcon/>
                    </IconButton>
    
                </Toolbar>
            </AppBar>
        </div>
    );
}