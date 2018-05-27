import React, { Component } from 'react';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import RegistrarContacto from './RegistrarContacto/RegistrarContacto';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import api from '../../../api';


class RegistrarEvento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      descripcion: '',
      rubro_id: 0,
      fecha_hora_inicio: new Date(),
      fecha_hora_fin: new Date(),
      // TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      errors: {},
      contactos: [{
        nombre: '',
        mail: '',
        telefono: '',
        contactId: '1',
      }],
      nextId: '2',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleRemoveContact = this.handleRemoveContact.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  handleContactChange(event, contactId) {
    const { value } = event.target;
    const field = event.target.name;
    const index = this.state.contactos.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contactos;
    newContactos[index][field] = value;
    this.setState({
      contactos: newContactos,
    });
  }

  handlePhoneChange(phone, contactId) {
    const index = this.state.contactos.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contactos;
    newContactos[index].telefono = phone;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }
  handleAddContact() {
    const newContact = {
      nombre: '',
      mail: '',
      telefono: '',
      contactId: this.state.nextId,
    };
    const newContactos = this.state.contactos.concat(newContact);
    this.setState({
      contactos: newContactos,
      nextId: parseInt(this.state.nextId, 10) + 1,
    });
  }
  handleRemoveContact(id) {
    if (this.state.contactos.length === 1) {
      return;
    }
    const newContactos = this.state.contactos;
    const indexOfRemove = newContactos.map(e => e.contactId).indexOf(id);
    newContactos.splice(indexOfRemove, 1);
    this.setState({
      contactos: newContactos,
    });
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

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
      };
      api.post('/actividades/eventos/', evento)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.props.history.push('registrar-necesidades');
        }).catch((error) => {
          if (error.response) { console.log(error.response.status); } else { console.log('Error: ', error.message); }
        });
    }
  }
  // Devuelve True si no hay errores
  validateContactos() {
    const errors = {};
    let isValid = true;
    const { contactos } = this.state.contactos;
    for (let i = 0; i <= contactos.length; i += 1) {
      // Es valido no ingresar ningun contacto
      if (contactos[i].nombre === '' &&
      contactos[i].mail === '' &&
      contactos[i].telefono === '' &&
      contactos.length === 1) {
        return isValid;
      }
      if (contactos[i].nombre === '') {
        errors.contactoNombre = 'No puede ingresar un contacto sin nombre';
        isValid = false;
      }
      if (contactos[i].mail === '' && contactos[i].telefono === '') {
        errors.contactoContacto = 'Debe ingresar un mail o un telefono';
        isValid = false;
      }
    }
    return isValid;
  }

  handleValidation(event) {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    } else { errors.nombre = undefined; }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
    isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas.';
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          inicio < ahora ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = 'Las fecha de fin debe ser mayor a la de inicio y ' +
          'la actividad no durar más de 24 horas.';
      } else { errors.fechas = undefined; }
    }
    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar los rubros.';
    } else { errors.rubro = undefined; }
    if (!this.validateContactos()) {
      formIsValid = false;
    }
    this.setState({ errors });
    return formIsValid;
  }

  render() {
    return (
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
            <label htmlFor="listaRubros">Rubro</label>
            <ListaRubrosEvento
              name="listaRubros"
              rubro={this.state.rubro_id}
              onRubroChange={this.handleRubroChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.rubro}</span>
          </div>
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <div className="form-group">
            <DateTimePicker
              name="inicio"
              onChange={this.handleFechaHoraInicioChange}
              isClockOpen={false}
              value={this.state.fecha_hora_inicio}
            />
            <DateTimePicker
              name="fin"
              onChange={this.handleFechaHoraFinChange}
              isClockOpen={false}
              value={this.state.fecha_hora_fin}
            />
          </div>
          <span style={{ color: 'red' }}>{this.state.errors.fechas}</span>
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            name="descripcion"
            rows="9"
            className="form-control"
            placeholder="Escriba una breve descripcion del evento."
            value={this.state.descripcion}
            onChange={this.handleInputChange}
          />
        </div>
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}
        />
        <RegistrarContacto
          onClickAdd={this.handleAddContact}
          onClickRemove={this.handleRemoveContact}
          onContactChange={this.handleContactChange}
          onPhoneChange={this.handlePhoneChange}
          contacts={this.state.contactos}
        />
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Guardar evento" />
        </div>

      </form>
    );
  }
}

export default RegistrarEvento;
