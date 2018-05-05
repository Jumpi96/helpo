import React, { Component } from 'react';
import ListaOrganizaciones from './ListaOrganizaciones/ListaOrganizaciones';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';

// Api
import axios from 'axios';
const common = require('../../common.js');
const config = common.config();

class RegistrarEvento extends Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        organizaciones: [{ id: 0, nombre: 'Sin organizaciones' }],
        organizacion: { id: 0, nombre: 'Sin organizaciones' },
        ubicacion: { latitud: 0, longitud: 0, notas: ''},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleOrganizacionChange = this.handleOrganizacionChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleOrganizacionChange(org) {
    this.setState({organizacion: org});
  }

  handleUbicacionChange(ubi) {
    this.setState({ubicacion: ubi});
    //console.log(ubi.latitud + " " + ubi.longitud)
  }

  handleSubmit(event) {
    event.preventDefault();

    const evento = {
      nombre: this.state.nombre,
      fecha: undefined,
      organizacion_id: 1, //TODO: Interfaz con estado de sesión de ONG
      ubicacion: this.state.ubicacion
    };
    console.log(evento);
    axios.post(config.apiUrl + '/eventos', { evento })
      .then(res => {
        console.log(res);
        console.log(res.data);
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  componentDidMount() {
    axios.get(config.apiUrl + '/organizaciones')
      .then(res => {
        const organizacionesData = res.data;
        this.setState({ organizaciones: organizacionesData, organizacion: organizacionesData[0] })
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Registrar evento</h1>
        <div className="row">
            <input type="text"
              name="nombre"
              placeholder="Nombre"
              value={this.state.nombre} 
              onChange={this.handleInputChange}
            />
        </div>
        <div className="row">
            <ListaOrganizaciones 
              name="listaOrganizaciones"
              organizacion={this.state.organizacion}
              organizaciones={this.state.organizaciones}
              onOrganizacionChange={this.handleOrganizacionChange} />
        </div>
        <div className="row">
          <SelectorUbicacion
            name="selectorUbicacion"
            ubicacion={this.state.ubicacion}
            onUbicacionChange={this.handleUbicacionChange}/>
        </div>
        <input type="submit" value="Guardar" />
      </form>
    );
  }
}

export default RegistrarEvento;