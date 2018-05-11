import React, { Component } from 'react';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';
import api from '../../api';


class RegistrarEvento extends Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        descripcion: '',
        rubro: {id: 0, nombre: "Sin rubros"},
        fecha_hora_inicio: Date.now(),
        fecha_hora_fin: Date.now(),
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
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

  handleFechaHoraInicioChange(fecha_hora){
    this.setState({fecha_hora_inicio: fecha_hora});
  }

  handleFechaHoraFinChange(fecha_hora){
    this.setState({fecha_hora_fin: fecha_hora});
  }

  handleSubmit(event) {
    event.preventDefault();

    const evento = {
      nombre: this.state.nombre,
      descripcion: this.state.descripcion,
      fecha_hora: this.state.fecha_hora_inicio.format('DD/MM/YYYY HH:mm'),
      rubro_id: this.state.rubro.id,
      ubicacion: this.state.ubicacion
    };
    console.log(evento);
    api.post('/actividades/eventos', { evento })
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
          <label for="nombre">Nombre</label>
          <input type="text"
            name="nombre" className="form-control"
            placeholder="Nombre"
            value={this.state.nombre} 
            onChange={this.handleInputChange}
          />
        </div>
        <SelectorFechaHora
          name="fecha_inicio" detalle="Inicio"
          value={this.state.fecha_hora_inicio}
          onFechaHoraChange={this.handleFechaHoraInicioChange}
        />
        <SelectorFechaHora
          name="fecha_fin" detalle="Fin"
          value={this.state.fecha_hora_fin}
          onFechaHoraChange={this.handleFechaHoraFinChange}
        />
        <div className="form-group">
          <label for="descripcion">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            placeholder="Escriba una breve descripcion del evento." 
            value={this.state.descripcion}
            onChange={this.handleInputChange}/>
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