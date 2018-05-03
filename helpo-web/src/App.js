import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './common/Header/Header';
import EventoActividad from './actividades/EventoActividad/EventoActividad'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header logo={logo} />
        <div className="container">
          <EventoActividad />
        </div>
      </div>
      
    );
  }
}

export default App;
