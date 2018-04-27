import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './common/Header/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header logo={logo} />
        <p className="App-intro">
          Fuck JS.
        </p>
      </div>
    );
  }
}

export default App;
