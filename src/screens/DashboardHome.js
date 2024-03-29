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
import WorkOffIcon from '@material-ui/icons/WorkOff';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {useMediaQuery} from 'react-responsive';
import HomeIcon from '@material-ui/icons/Home';
import StudentGatePassMedical from "./sub-screens/StudentGatePassMedical";
import LeaveODApproval from "./sub-screens/LeaveODApproval";
import FacultyLeaveApplication from "./sub-screens/FacultyLeaveApplication";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import HomeScreen from './sub-screens/HomeScreen';
import CourseInfoScreen from './sub-screens/CourseInfoScreen';


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
    const removeCookie = useCookies(['faculty-dash-auth'])[2];
    const [sidebarOpen, setSidebarOpen]  = useState(false);
    const history=useHistory();
    let subScreenList=[<HomeScreen/>,<Profile/>,<FacultyLeaveApplication/>,<LeaveODApproval key={'hodLeaveApprove'} passRoute={"hodLeaveApprove"}/>,<CourseInfoScreen/>,<StudentGatePassMedical/>,<LeaveODApproval key={'odform'} passRoute={'odform'}/>,<MentorDiary/>];
    let subScreenNames=["Home","Profile","Leave Management","Leave Approval","Course Info","Student Gate Passes","OD Forms","Mentoring Diary"];
    const [curScreen,setCurScreen]=useState(sessionStorage.DASHBOARD_SUB_SCREEN_ID);
    const [isHOD,setIsHOD]=useState(false);
    const isSmallWidth = useMediaQuery({ query: '(max-width: 1224px)' });


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
            return;
        }
        if(sessionStorage.HOD==='true'){
            setIsHOD(true);
        }else{
            setIsHOD(false);
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
                <ListItem button key="Home" id="dashboardHomeBtn" onClick={()=>handleSubScreenChange(0)}>
                        <ListItemIcon>{<HomeIcon/>}</ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <ListItem button key="Profile" id="dashboardProfileBtn" onClick={()=>handleSubScreenChange(1)}>
                        <ListItemIcon>{<AccountCircleIcon/>}</ListItemIcon>
                        <ListItemText primary="Profile"/>
                    </ListItem>
                    {!isHOD && <ListItem button key="FacultyAttendance" id="dashboardLeaveManagementBtn"
                               onClick={() => handleSubScreenChange(2)}>
                        <ListItemIcon>{<ListIcon/>}</ListItemIcon>
                        <ListItemText primary="Leave Management"/>
                    </ListItem>}
                    {isHOD && <ListItem button key="LeaveApproval" id="dashboardLeaveApprovalBtn"
                               onClick={() => handleSubScreenChange(3)}>
                        <ListItemIcon>{<LockOpenIcon/>}</ListItemIcon>
                        <ListItemText primary="Leave Approval"/>
                    </ListItem>}
                    <ListItem button key="Course Info" id="dashboardCourseBtn" onClick={()=>handleSubScreenChange(4)}>
                        <ListItemIcon>{<HourglassEmptyIcon/>}</ListItemIcon>
                        <ListItemText primary="Course Info"/>
                    </ListItem>
                    {sessionStorage.FACULTY_TYPE==='advisor' && <ListItem button key="Gate Pass" id="dashboardStudentPassBtn" onClick={()=>handleSubScreenChange(5)}>
                        <ListItemIcon>{<AssignmentIcon/>}</ListItemIcon>
                        <ListItemText primary="Student Passes"/>
                    </ListItem>}
                    <ListItem button key="OD Forms" id="dashboardODFormBtn" onClick={()=>handleSubScreenChange(6)}>
                        <ListItemIcon>{<WorkOffIcon/>}</ListItemIcon>
                        <ListItemText primary="OD Forms"/>
                    </ListItem>
                    {sessionStorage.FACULTY_TYPE==='advisor' && <ListItem button key="Mentoring Diary" id="dashboardMentorBtn" onClick={()=>handleSubScreenChange(7)}>
                        <ListItemIcon>{<BookIcon/>}</ListItemIcon>
                        <ListItemText primary="Mentoring Diary"/>
                    </ListItem>}

                    <ListItem button key="Calendar" id="dashboardCalendarBtn" onClick={()=>window.open('https://intranet.cb.amrita.edu/sites/default/files/2020_2021_Academic_calendar_29_MAR_2021.pdf','_blank')}>   
                        <ListItemIcon>{<CalendarTodayIcon/>}</ListItemIcon>
                        <ListItemText primary="Get Your Calendar"/>
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