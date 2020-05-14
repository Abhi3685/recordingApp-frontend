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

function App() {
  return (
    <Router>
      <Switch>
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
