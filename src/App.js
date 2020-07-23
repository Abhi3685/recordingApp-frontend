import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Recorder from './components/Recorder';
import CustomPlayer from './components/Player';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Trim from './components/Trim';
import AddText from './components/AddText';
import Watermark from './components/Watermark';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup"><Signup /></Route>
        <Route path="/signin"><Signin /></Route>
        <Route path="/about"><About /></Route>
        <Route path="/contact"><Contact /></Route>
        <Route path="/player/:videoId"><CustomPlayer /></Route>
        <Route path="/recorder"><Recorder /></Route>
        <Route path="/trim"><Trim /></Route>
        <Route path="/addText"><AddText /></Route>
        <Route path="/watermark"><Watermark /></Route>
        <Route path="/dashboard"><Dashboard /></Route>
        <Route path="/"><Home /></Route>
      </Switch>
    </Router>
  );
}

export default App;
