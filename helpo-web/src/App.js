import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './common/Header/Header';
import EventoActividad from './actividades/EventoActividad/EventoActividad'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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

class Actividades extends Component {
  render() {
    return (
      <div>
        <h3>Actividades</h3>
        <ul>
          <li>
            <Link to={"actividades/registrarEvento"}>Registrar evento</Link>
          </li>
        </ul>
        
        <hr/>
        <Route exact path="/actividades" render={() => <h4>Selecciona una opción</h4>} />
        <Route path={"/actividades/registrarEvento"} component={EventoActividad} />
      </div>
    )
  }
}

export default App;
