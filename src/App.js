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
import Trim from './components/Trim';
import AddText from './components/AddText';
import Watermark from './components/Watermark';

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
        <Route path="/trim">
          <Trim />
        </Route>
        <Route path="/addText">
          <AddText />
        </Route>
        <Route path="/watermark">
          <Watermark />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
