import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import { PropTypes } from 'prop-types';
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import RegistrarContacto from '../Actividades/RegistrarEvento/RegistrarContacto/RegistrarContacto';


class EventoForm extends React.Component {  
  constructor(props) {
    super(props);
    this.state = { errors: [] };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
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
                onChange={this.props.onChange}
              />
              <span style={{ color: 'red' }}>{this.state.errors.nombre}</span>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="listaRubros">Rubro</label>
              <select
                value={this.props.evento.rubro.id}
                className="form-control"
                onChange={this.props.onChange}>
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
                onChange={this.props.onChange}
                isClockOpen={false}
                value={fechaInicio}
              />
              <DateTimePicker
                name="fin"
                onChange={this.props.onChange}
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
              onChange={this.props.onChange}
            />
          </div>
          <SelectorUbicacion
            name="ubicacion"
            ubicacion={this.props.evento.ubicacion}
            onUbicacionChange={this.props.onChange}
          />
          <RegistrarContacto
            contacts={this.props.contactos}          
          />
          <span style={{ color: 'red' }}>{this.state.errors.contactoNombre}</span><p>{"\n"}</p>
          <span style={{ color: 'red' }}>{this.state.errors.contactoContacto}</span><p>{"\n"}</p>
          <span style={{ color: 'red' }}>{this.state.errors.email}</span>
          <input
            type="submit"
            disabled={this.props.saving}
            className="btn btn-primary"
            value="Guardar evento"
            onClick={this.props.onSave}/>
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