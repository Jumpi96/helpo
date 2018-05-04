import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Header from './common/Header/Header';
import Actividades from './actividades/Actividades'


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header logo={logo} />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/actividades">Actividades</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={Home} />
          <Route path="/actividades" component={Actividades} />
        </div>
      </Router>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <h3>This is Home</h3>
    )
  }
}

export default App;
