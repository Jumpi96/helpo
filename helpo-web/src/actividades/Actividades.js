import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import RegistrarEvento from './RegistrarEvento/RegistrarEvento';
import RegistrarNecesidades from './RegistrarNecesidades/RegistrarNecesidades';

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
          <Route path={"/actividades/registrarEvento"} component={RegistrarEvento} />
          <Route path={"/actividades/registrarNecesidades"} component={RegistrarNecesidades} />
        </div>
      )
    }
  }
  
  export default Actividades;
  