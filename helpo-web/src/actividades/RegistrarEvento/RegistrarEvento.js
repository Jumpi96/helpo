import React, { Component } from 'react';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
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
        rubro: {id: 0, nombre: "Sin rubros"},
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleRubroChange(r) {
    this.setState({rubro: r});
  }

  handleUbicacionChange(ubi) {
    this.setState({ubicacion: ubi});
  }

  handleSubmit(event) {
    event.preventDefault();

    const evento = {
      nombre: this.state.nombre,
      fecha: undefined,
      rubro_id: this.state.rubro.id,
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Registrar evento</h1>
        <div className="form-group">
            <input type="text"
              name="nombre"
              placeholder="Nombre"
              value={this.state.nombre} 
              onChange={this.handleInputChange}
            />
        </div>
        <div className="form-group">
            <ListaRubrosEvento 
              name="listaRubros"
              rubro={this.state.rubro}
              onRubroChange={this.handleRubroChange} />
        </div>
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}/>
        <input type="submit" value="Guardar" />
      </form>
    );
  }
}

export default RegistrarEvento;