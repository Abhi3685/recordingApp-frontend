import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './components/Home';
import Recorder from './components/Recorder';
import Player from './components/Player';
import Signup from './components/Signup';
import Signin from './components/Signin';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/player">
          <Player />
        </Route>
        <Route path="/recorder">
          <Recorder />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
