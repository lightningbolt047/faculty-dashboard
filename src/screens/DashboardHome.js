import { Box, IconButton, makeStyles} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {useHistory} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Drawer from '@material-ui/core/Drawer';
import { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import clsx from 'clsx';
import MentorDiary from './sub-screens/MentorDiary';
import BookIcon from '@material-ui/icons/Book';
import CloseIcon from '@material-ui/icons/Close';
import ListIcon from '@material-ui/icons/List';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';


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
    console.log("sessionStorage "+sessionStorage.USER_DB_ID);

    const logoutRoutine=()=>{
        removeCookie("dbID");
        removeCookie("authToken");
        sessionStorage.clear();
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
            <MentorDiary/>
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
                    <ListItem button key="Profile">
                        <ListItemIcon>{<AccountCircleIcon/>}</ListItemIcon>
                        <ListItemText primary="Profile"/>
                    </ListItem>
                    <ListItem button key="Attendance">
                        <ListItemIcon>{<ListIcon/>}</ListItemIcon>
                        <ListItemText primary="Attendance"/>
                    </ListItem>
                    <ListItem button key="Course Info">
                        <ListItemIcon>{<HourglassEmptyIcon/>}</ListItemIcon>
                        <ListItemText primary="Course Info"/>
                    </ListItem>
                    <ListItem button key="Gate Pass">
                        <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                        <ListItemText primary="Gate Pass"/>
                    </ListItem>
                    <ListItem button key="Mentoring Diary">
                        <ListItemIcon>{<BookIcon/>}</ListItemIcon>
                        <ListItemText primary="Mentoring Diary"/>
                    </ListItem>
               
                    <ListItem button onClick={()=>setSidebarOpen(false)}>
                        <ListItemIcon>{<CloseIcon/>}</ListItemIcon>
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