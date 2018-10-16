import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import RegistrarContacto from './RegistrarContacto/RegistrarContacto';
import SelectorHorarios from './SelectorHorarios/SelectorHorarios';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import api from '../../../api';
import validateEmail from '../../../utils/ValidateEmail'
import './RegistrarEvento.css';

class RegistrarEvento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      descripcion: '',
      rubro_id: 0,
      fecha_hora_inicio: new Date(),
      fecha_hora_fin: new Date(),
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      errors: {},
      contactos: [],
      horarios: [],
      esEvento: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    this.handleActualizacionContactos = this.handleActualizacionContactos.bind(this);
    this.selectTipoEvento = this.selectTipoEvento.bind(this);
    this.handleHorariosChange = this.handleHorariosChange.bind(this);
  }



  handleActualizacionContactos(nuevosContactos) {
    this.setState({
      contactos: nuevosContactos
    });
  }


  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }

  handleOrganizacionChange(org) {
    this.setState({ organizacion: org });
  }
  handleUbicacionChange(ubi) {
    this.setState({ ubicacion: ubi });
  }

  handleFechaHoraInicioChange(fecha_hora) {
    this.setState({ fecha_hora_inicio: fecha_hora, fecha_hora_fin: fecha_hora });
  }

  handleFechaHoraFinChange(fecha_hora) {
    this.setState({ fecha_hora_fin: fecha_hora });
  }

  getContactosInfo() {
    const contactos = this.state.contactos;
    let info_contactos = [];
    //Si no hay contactos, retorno array vacio    
    if (contactos[0] === undefined || contactos[0].nombre === "") {
      return info_contactos;
    }
    for (let i = 0; i < contactos.length; i += 1) {
      const telefono_info = contactos[i].telefono !== "" ? contactos[i].telefono : null;
      const email_info = contactos[i].email !== "" ? contactos[i].email : null;

      const cto = {
        nombre: contactos[i].nombre,
        email: email_info,
        telefono: telefono_info,
      }
      info_contactos[i] = cto;
    }
    return info_contactos;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) { //Atencion a como se postean los contactos como contacto sin "S"
    event.preventDefault();
    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        contacto: this.getContactosInfo(),
        campaña: this.state.esEvento === 0
      };
      if (this.state.esEvento === 0) { evento.horarios = this.state.horarios; }
      api.post('/actividades/eventos/', evento)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.props.history.push({
            pathname: 'registrar-necesidades',
            search: '?evento=' + res.data.id, //{ evento_id: res.data.id }
          });
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
        });
    }
  }

  validateContactos() {
    let errors = { contactoNombre: "", contactoContacto: "", email: "" };
    let validacion = { is_valid: true, errors: errors };
    const contactos = this.state.contactos;
    for (let i = 0; i < contactos.length; i += 1) {
      // Es valido no ingresar ningun contacto
      if (contactos[i].nombre === "" &&
        contactos[i].mail === "" &&
        contactos[i].telefono === "" &&
        contactos.length === 1) {
        return validacion;
      }
      if (contactos[i].nombre === "") {
        errors.contactoNombre = 'No puede ingresar un contacto sin nombre';
        validacion.is_valid = false;
      }
      if (contactos[i].mail === "" && contactos[i].telefono === "") {
        errors.contactoContacto = 'Debe ingresar un mail o un teléfono';
        validacion.is_valid = false;
      }
      if (contactos[i].mail !== "" && !validateEmail(contactos[i].mail)) {
        errors.email = 'Debe ingresar un mail válido';
        validacion.is_valid = false;
      }
    }
    validacion.errors = errors;
    return validacion;
  }

  handleValidation(event) {
    let formIsValid = true;
    const errors = this.state.errors;
    const inicio = moment(this.state.fecha_hora_inicio);
    const fin = moment(this.state.fecha_hora_fin);
    const actual = moment(new Date());

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre';
    } else { errors.nombre = undefined; }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
      isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas';
    } else {
      if (inicio < actual) {
        formIsValid = false;
        errors.fechas = 'La fecha de inicio debe ser posterior a la fecha actual';
      } else {
        if (fin < inicio) {
          formIsValid = false;
          errors.fechas = 'La fecha de inicio debe ser anterior a la fecha de fin de la actividad'
        } else {
          if (moment.duration(fin.diff(inicio)).asHours() > 24 && inicio < fin && this.state.esEvento) {
            formIsValid = false;
            errors.fechas = 'El evento no puede durar más de 24 horas'
          }
          else {
            errors.fechas = undefined;
          }
        }
      }
    }

    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar los rubros';
    } else { errors.rubro = undefined; }
    this.setState({ errors: errors });
    return formIsValid;
  }

  selectTipoEvento(e) {
    this.setState({ esEvento: parseInt(e.target.value, 10) });
  }

  handleHorariosChange(horarios) {
    this.setState({ horarios });
  }

  getMensaje() {
    if (this.state.esEvento === 1) {
      return (
        <p className="mensaje">
          Un <b>evento</b> es una actividad que se realiza en <b>un día y horario determinado</b>.
          Voluntarios y empresas podrán aportar<b> hasta el inicio</b> del evento.
        </p>
      );
    } else {
      return (
        <p className="mensaje">
          Una <b>campaña</b> es una actividad que dura un <b>período prolongado de tiempo</b>.
          Voluntarios y empresas podrán aportar <b>durante toda su duración</b>.
        </p>
      );
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete los datos de la actividad
          </CardHeader>
          <CardBody>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Nombre"
                    value={this.state.nombre}
                    onChange={this.handleInputChange}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors.nombre}</span>
                </div>
                <div className="form-group col-md-6">
                  <h4>Tipo de actividad social</h4>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={this.state.esEvento === 1}
                        onClick={this.selectTipoEvento}
                      />
                      Evento
                  </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        value={0}
                        checked={this.state.esEvento === 0}
                        onClick={this.selectTipoEvento}
                      />
                      Campaña
                  </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="listaRubros">Rubro</label>
                  <ListaRubrosEvento
                    name="listaRubros"
                    rubro={this.state.rubro_id}
                    onRubroChange={this.handleRubroChange}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors.rubro}</span>
                </div>
                <div className="col-md-6">
                  {this.getMensaje()}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-1">
                  <label>Inicio:  </label>
                </div>
                <div className="form-group col-md-3">
                  <DateTimePicker
                    name="inicio"
                    onChange={this.handleFechaHoraInicioChange}
                    isClockOpen={false}
                    value={this.state.fecha_hora_inicio}
                  />
                </div>
                <div className="form-group col-md-1">
                  <label>Fin:  </label>
                </div>
                <div className="form-group col-md-3">
                  <DateTimePicker
                    name="fin"
                    onChange={this.handleFechaHoraFinChange}
                    isClockOpen={false}
                    value={this.state.fecha_hora_fin}
                  />
                </div>
              </div>
              <div className="form-group offset-md-1">
                <span style={{ color: 'red' }}>{this.state.errors.fechas}</span>
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  name="descripcion"
                  rows="9"
                  className="form-control"
                  placeholder="Escriba una breve descripcion de la actividad."
                  value={this.state.descripcion}
                  onChange={this.handleInputChange}
                />
              </div>
              {this.state.esEvento === 0 ?
                <SelectorHorarios
                  horarios={this.state.horarios}
                  onHorariosChange={this.handleHorariosChange}
                /> : undefined
              }
              <SelectorUbicacion
                name="selectorUbicacion"
                ubicacion={this.state.ubicacion}
                onUbicacionChange={this.handleUbicacionChange}
              />
              <RegistrarContacto
                actualizarContactos={this.handleActualizacionContactos}
                contacts={this.state.contactos}
              />
              <span style={{ color: 'red' }}>{this.state.errors.contactoNombre}</span><p>{"\n"}</p>
              <span style={{ color: 'red' }}>{this.state.errors.contactoContacto}</span><p>{"\n"}</p>
              <span style={{ color: 'red' }}>{this.state.errors.email}</span>
              <div className="form-group">
                <input type="submit" className="btn btn-primary" value="Guardar actividad social" />
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default RegistrarEvento;
