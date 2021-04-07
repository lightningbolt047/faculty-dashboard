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
import { useState , useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import clsx from 'clsx';
import MentorDiary from './sub-screens/MentorDiary';
import Profile from './sub-screens/Profile';
import BookIcon from '@material-ui/icons/Book';
import CloseIcon from '@material-ui/icons/Close';
import ListIcon from '@material-ui/icons/List';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {useMediaQuery} from 'react-responsive';
import HomeIcon from '@material-ui/icons/Home';
import StudentGatePassOD from "./sub-screens/StudentGatePassOD";


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
          width: theme.spacing(7) + 1,
        },
      }
}));



export default function DashboardHome(){
    
    const useStyles=styles();
    // eslint-disable-next-line
    const removeCookie = useCookies(['faculty-dash-auth'])[2];
    const [sidebarOpen, setSidebarOpen]  = useState(false);
    const history=useHistory();
    let subScreenList=[<div/>,<Profile/>,<MentorDiary/>,<StudentGatePassOD/>];
    let subScreenNames=["Home","Profile","Mentoring","Student Gate Pass"]
    const [curScreen,setCurScreen]=useState(sessionStorage.DASHBOARD_SUB_SCREEN_ID);
    const isSmallWidth = useMediaQuery({ query: '(max-width: 1224px)' });

    console.log("sessionStorage "+sessionStorage.DASHBOARD_SUB_SCREEN_ID);

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
        return sidebarWidth/4.5;
    }

    const getMainUIContent=()=>{
        return subScreenList[curScreen];
    }

    const handleSubScreenChange=(index)=>{
        sessionStorage.DASHBOARD_SUB_SCREEN_ID=index;
        setCurScreen(index);
        setSidebarOpen(false);
    }

    useEffect(()=>{
        if(typeof sessionStorage.USER_DB_ID==='undefined' || typeof sessionStorage.USER_AUTH_TOKEN==='undefined'){
            history.replace('/');
        }
        // eslint-disable-next-line
    },[]);

    return (
        <div>
            <AppBar className="dashboardHomeAppBar" position="static">
                <Toolbar>
                    <Box width={getPlaceholderBoxWidth()}/>
                    <Box display="flex" flexGrow={1}>
                        <IconButton edge="start" color="inherit" onClick={()=>setSidebarOpen(!sidebarOpen)}>
                            <MenuIcon/>
                        </IconButton>
                        <h2>{subScreenNames[curScreen]}</h2>
                    </Box>
                    {!isSmallWidth && <div>
                        <h2 id="userGreetMessage">Hello {sessionStorage.FACULTY_NAME} !</h2>
                    </div>}
                    <IconButton color="inherit" id={"appBarProfile"} className="dashboardHomeAccountCircle" onClick={()=>handleSubScreenChange(1)}>
                        <AccountCircleIcon/>
                    </IconButton>
                    <IconButton color="inherit" id={"appBarLogout"} className="dashboardHomeAccountCircle" onClick={logoutRoutine}>
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
                <ListItem button key="Home" onClick={()=>handleSubScreenChange(0)}>
                        <ListItemIcon>{<HomeIcon/>}</ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <ListItem button key="Profile" onClick={()=>handleSubScreenChange(1)}>
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
                    {sessionStorage.FACULTY_TYPE==='advisor' && <ListItem button key="Gate Pass" onClick={()=>handleSubScreenChange(3)}>
                        <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                        <ListItemText primary="Gate Pass/OD"/>
                    </ListItem>}
                    {sessionStorage.FACULTY_TYPE==='advisor' && <ListItem button key="Mentoring Diary" onClick={()=>handleSubScreenChange(2)}>
                        <ListItemIcon>{<BookIcon/>}</ListItemIcon>
                        <ListItemText primary="Mentoring Diary"/>
                    </ListItem>}
               
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