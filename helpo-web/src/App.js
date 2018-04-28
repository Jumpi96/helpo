import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './common/Header/Header';
import RegistroActividad from './actividades/RegistroActividad/RegistroActividad'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header logo={logo} />
        <RegistroActividad />
      </div>
    );
  }
}

export default App;
