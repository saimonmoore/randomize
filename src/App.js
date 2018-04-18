import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Session from './Session.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Randomize</h1>
        </header>
        <Session />
      </div>
    );
  }
}

export default App;
