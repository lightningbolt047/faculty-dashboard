import { Box, IconButton, makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import {useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Drawer from '@material-ui/core/Drawer';
import { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';


export default function DashboardHome(){

    const useStyles = makeStyles((theme)=>({
        appbarBefore: {
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        }
        
    }));

    // eslint-disable-next-line
    const [cookies, setCookie, removeCookie] = useCookies(['faculty-dash-auth']);
    const [sidebarOpen, setSidebarOpen]  = useState(false);
    const history=useHistory();
    var iconText = ["Icon 1","Icon 2","Icon 3","Icon 4","Icon 5"];
    var icons = [<MenuIcon/>,<LogoutIcon/>,<MenuIcon/>,<LogoutIcon/>,<MenuIcon/>];

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
                        <IconButton edge="start" color="inherit" onClick={()=>console.log("Menu Clicked")}>
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
            <Drawer variant='permanent'>
                    <List>
                        {iconText.map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{icons[index]}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                    </List>
            </Drawer>
        </div>
    );
}