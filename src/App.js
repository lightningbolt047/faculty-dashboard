import './index.css';
import LoginScreen from './screens/LoginScreen';
import ForgotPwd from './screens/ForgotPassswordScreen';
import DashboardHome from './screens/DashboardHome';
import ChangePassword from './screens/ChangePasswordScreen';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/recovery">
            <ForgotPwd/>
          </Route>
          <Route exact path="/authChange">  
            <ChangePassword/>
          </Route>
          <Route exact path="/dashboard">
            <DashboardHome/>
          </Route>
          <Route path="/">
            <LoginScreen/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
