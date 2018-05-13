import React, { Component } from 'react';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';
import moment from 'moment';
import api from '../../api';


class RegistrarEvento extends Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        descripcion: '',
        rubro_id: 0,
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
        errors: {}
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
    this.setState({rubro_id: r});
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
    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion
      };
      api.post('/actividades/eventos/', evento)
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.props.history.push('registrarNecesidades');
        }).catch(function (error) {
          if (error.response){ console.log(error.response.status) }
          else { console.log('Error: ', error.message)}
        });
    }
  }

  handleValidation(event) {
    let formIsValid = true;
    var errors = this.state.errors

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = "Debe ingresar un nombre.";
    }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
    isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = "Las fechas ingresadas no son válidas.";
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          moment.duration(inicio.diff(moment()) < 0) ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = "Las fecha de fin debe ser mayor a la de inicio y " +
          "la actividad no durar más de 24 horas.";
      }
    }
    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = "Hubo un problema al cargar los rubros.";
    }

    this.setState({errors: errors});
    return formIsValid;
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
          <span style={{color: "red"}}>{this.state.errors["nombre"]}</span>
        </div>
        <div>
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
          <span style={{color: "red"}}>{this.state.errors["fechas"]}</span>
        </div>
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
          <label for="listaRubros">Rubro</label>
          <ListaRubrosEvento 
            name="listaRubros"
            rubro={this.state.rubro_id}
            onRubroChange={this.handleRubroChange} />
          <span style={{color: "red"}}>{this.state.errors["rubro"]}</span>
        </div>
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}/>
        <input type="submit" className="btn btn-primary" value="Guardar" />
      </form>
    );
  }
}

export default RegistrarEvento;