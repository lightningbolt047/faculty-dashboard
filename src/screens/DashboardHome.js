import { Box, IconButton, makeStyles} from '@material-ui/core';
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
import clsx from 'clsx';
import Profile from './sub-screens/Profile';


const sidebarWidth=240;

const styles=makeStyles((theme)=>({
    sidebar:{
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    sidebarOpen:{
        width:sidebarWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    sidebarClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9) + 1,
        },
      }

}));



export default function DashboardHome(){
    
    const useStyles=styles();
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
    };

    const getPlaceholderBoxWidth=()=>{
        if(sidebarOpen){
            return sidebarWidth;
        }
        return sidebarWidth/3.5;
    }

    const getMainUIContent=()=>{
        return (
            <Profile/>
        );
    }

    return (
        <div>
            <AppBar className="dashboardHomeAppBar" position="static">
                <Toolbar>
                    <Box width={getPlaceholderBoxWidth()}/>
                    <Box display="flex" flexGrow={1}>
                        <IconButton edge="start" color="inherit" onClick={()=>setSidebarOpen(!sidebarOpen)}>
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
            <Drawer variant='permanent'
            className={clsx(useStyles.sidebar,{
                [useStyles.sidebarOpen]: sidebarOpen,
                [useStyles.sidebarClose]:!sidebarOpen
            })}
            classes={{
                paper:clsx({
                    [useStyles.sidebarOpen]: sidebarOpen,
                    [useStyles.sidebarClose]:!sidebarOpen
                })
            }}
            >
                <List>
                    {iconText.map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon>{icons[index]}</ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
                <ListItem button onClick={()=>setSidebarOpen(false)}>
                    <ListItemIcon>{<MenuIcon/>}</ListItemIcon>
                    <ListItemText primary={"Close"} />
                    </ListItem>
                </List>
            </Drawer>
            <div className="dashboardContentSpace">
                {getMainUIContent()}
            </div>
        </div>
    );
}