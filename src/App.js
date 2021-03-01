import './App.css';
import './screens/Login';
import LoginScreen from './screens/Login';
import ForgotPwd from './screens/ForgotPwd';
import DashboardHome from './screens/DashboardHome';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';




function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/recovery">
            <ForgotPwd/>
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
