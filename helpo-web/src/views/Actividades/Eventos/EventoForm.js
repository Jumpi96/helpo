import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import SelectorUbicacion from '../RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import RegistrarContacto from '../RegistrarEvento/RegistrarContacto/RegistrarContacto';
import SelectorHorarios from '../RegistrarEvento/SelectorHorarios/SelectorHorarios';
import validateEmail from '../../../utils/ValidateEmail';


class EventoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleActualizacionContactos = this.handleActualizacionContactos.bind(this);
    this.handleActualizacionHorarios = this.handleActualizacionHorarios.bind(this);
  }


  handleChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  handleRubroChange(e) {
    const rubro = e.target.value;
    this.props.onChange('rubro_id', rubro);
  }

  handleUbicacionChange(ubi) {
    this.props.onChange('ubicacion', ubi);
  }

  handleFechaHoraInicioChange(fecha_hora) {
    this.props.onChange('fecha_hora_inicio', fecha_hora);
    this.props.onChange('fecha_hora_fin', fecha_hora);
  }

  handleFechaHoraFinChange(fecha_hora) {
    this.props.onChange('fecha_hora_fin', fecha_hora);
  }

  handleActualizacionContactos(nuevosContactos) {
    this.props.onChange('contacto', nuevosContactos);
  }

  handleActualizacionHorarios(horarios) {
    this.props.onChange('horarios', horarios);
  }

  handleSave() {
    if (this.handleValidation()) {
      this.props.onSave();
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.props.evento.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    } else { errors.nombre = undefined; }

    if (isNaN(Date.parse(this.props.evento.fecha_hora_inicio)) ||
      isNaN(Date.parse(this.props.evento.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas.';
    } else {
      const inicio = moment(this.props.evento.fecha_hora_inicio);
      const fin = moment(this.props.evento.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
        inicio < ahora ||
        moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = 'Las fecha de fin debe ser mayor a la de inicio y ' +
          'la actividad no durar más de 24 horas.';
      } else { errors.fechas = undefined; }
    }
    if (this.props.evento.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar los rubros.';
    } else { errors.rubro = undefined; }
    this.setState({ errors });
    return formIsValid;
  }

  validateContactos() {
    let errors = { contactoNombre: "", contactoContacto: "", email: "" };
    let validacion = { is_valid: true, errors: errors };
    const contactos = this.props.evento.contacto;
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

  parseISOString(s) {
    if (s[s.length - 1] === 'Z') {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    } else {
      return s;
    }
  }



  render() {
    const listaRubroEventos = this.props.rubros.map((r) =>
      <option value={r.id}>{r.nombre}</option>
    );
    const fechaInicio = this.parseISOString(this.props.evento.fecha_hora_inicio);
    const fechaFin = this.parseISOString(this.props.evento.fecha_hora_fin);
    return (
      <div>
        <form>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Nombre"
                value={this.props.evento.nombre}
                onChange={this.handleChange}
              />
              <span style={{ color: 'red' }}>{this.state.errors.nombre}</span>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="listaRubros">Rubro</label>
              <select
                value={this.props.evento.rubro_id}
                className="form-control"
                onChange={this.handleRubroChange}>
                {listaRubroEventos}
              </select>
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
                value={fechaInicio}
              />
              <DateTimePicker
                name="fin"
                onChange={this.handleFechaHoraFinChange}
                isClockOpen={false}
                value={fechaFin}
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
              value={this.props.evento.descripcion}
              onChange={this.handleChange}
            />
          </div>
          {this.props.evento.campaña ?
            <SelectorHorarios
              horarios={this.props.evento.horarios}
              onHorariosChange={this.handleActualizacionHorarios}
            /> : undefined
          }
          <SelectorUbicacion
            name="ubicacion"
            ubicacion={this.props.evento.ubicacion}
            onUbicacionChange={this.handleUbicacionChange}
          />
          <RegistrarContacto
            actualizarContactos={this.handleActualizacionContactos}
            contacts={this.props.evento.contacto}
          />
          <span style={{ color: 'red' }}>{this.state.errors.contactoNombre}</span><p>{"\n"}</p>
          <span style={{ color: 'red' }}>{this.state.errors.contactoContacto}</span><p>{"\n"}</p>
          <span style={{ color: 'red' }}>{this.state.errors.email}</span>
          <input
            type="submit"
            disabled={this.props.saving}
            className="btn btn-primary"
            value="Guardar evento"
            onClick={this.handleSave} />
        </form>
      </div>
    );
  }
}

EventoForm.propTypes = {
  evento: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default EventoForm;  