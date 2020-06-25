import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './components/Home';
import About from './components/About';
import Videos from './components/Videos';
import Recorder from './components/Recorder';
import Player from './components/Player';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Trim from './components/Trim';
import AddText from './components/AddText';
import Watermark from './components/Watermark';
import Page from './components/Page';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>

        <Route path="/player/:videoId">
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
        <Route path="/page/:pageId">
          <Page />
        </Route>
        <Route path="/videos">
          <Videos />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
