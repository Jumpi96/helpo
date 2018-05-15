import React, { Component } from 'react';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import DateTimePicker from 'react-datetime-picker';
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
    this.setState({fecha_hora_inicio: fecha_hora, fecha_hora_fin: fecha_hora});
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
    else
      errors.nombre = undefined;

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
    isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = "Las fechas ingresadas no son válidas.";
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          inicio < ahora ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = "Las fecha de fin debe ser mayor a la de inicio y " +
          "la actividad no durar más de 24 horas.";
      }
      else
        errors.fechas = undefined;
    }
    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = "Hubo un problema al cargar los rubros.";
    }
    else
      errors.rubro = undefined;

    this.setState({errors: errors});
    return formIsValid;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Registrar evento</h1>
        <div className="row">
        <div className="form-group col-md-6">
          <label for="nombre">Nombre</label>
          <input type="text" 
            name="nombre" className="form-control"
            placeholder="Nombre"
            value={this.state.nombre} 
            onChange={this.handleInputChange}
          />
          <span style={{color: "red"}}>{this.state.errors["nombre"]}</span>
        </div>
        <div className="form-group col-md-6">
          <label for="listaRubros">Rubro</label>
          <ListaRubrosEvento 
            name="listaRubros"
            rubro={this.state.rubro_id}
            onRubroChange={this.handleRubroChange} />
          <span style={{color: "red"}}>{this.state.errors["rubro"]}</span>
        </div>
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <div className="form-group">
            <DateTimePicker name="inicio"
              onChange={this.handleFechaHoraInicioChange}
              isClockOpen={false}
              value={this.state.fecha_hora_inicio}
            />
            <DateTimePicker name="fin"
              onChange={this.handleFechaHoraFinChange}
              isClockOpen={false}
              value={this.state.fecha_hora_fin}
            />
          </div>
          <span style={{color: "red"}}>{this.state.errors["fechas"]}</span>
        </div>
        <div className="form-group">
          <label for="descripcion">Descripción</label>
          <textarea
            name="descripcion" rows="9"
            className="form-control"
            placeholder="Escriba una breve descripcion del evento." 
            value={this.state.descripcion}
            onChange={this.handleInputChange}/>
        </div>
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}/>
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Guardar evento" />
        </div>
      </form>
    );
  }
}

export default RegistrarEvento;