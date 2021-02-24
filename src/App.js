import './App.css';
import './screens/Login';
import LoginScreen from './screens/Login';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';




function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/recovery">
            Recovery
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
