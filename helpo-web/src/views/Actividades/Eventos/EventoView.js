import React from 'react';
import { PropTypes } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import EventoForm from './EventoForm';
import './Eventos.css';
import ButtonsCompartirEvento from '../../common/ButtonsCompartir/ButtonsCompartirEvento';
import { Link } from 'react-router-dom'

class EventoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      evento: this.props.evento,
      saving: false,
      showModalEliminar: false
    }
    this.updateEventoState = this.updateEventoState.bind(this);
    this.saveEvento = this.saveEvento.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleEditNecesidades = this.toggleEditNecesidades.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.confirmDeleteNecesidad = this.confirmDeleteNecesidad.bind(this);
    this.toggleConsultarColaboraciones = this.toggleConsultarColaboraciones.bind(this);
    this.toggleMensajes = this.toggleMensajes.bind(this);
    this.togglePatrocinadores = this.togglePatrocinadores.bind(this);
  }

  toggleEdit() {
    this.setState({ isEditing: true });
  }

  toggleConsultarColaboraciones() {
    this.props.history.push({
      pathname: '/actividades/consultar-colaboraciones',
      search: '/' + this.state.evento.id,
    });
  }

  toggleEditNecesidades() {
    this.props.history.push({
      pathname: '/actividades/registrar-necesidades',
      search: '?evento=' + this.state.evento.id,
    });
  }

  confirmDeleteNecesidad(del) {
    if (del) {
      this.props.actions.deleteEvento(this.state.evento);
      this.props.history.push({
        pathname: '/dashboard',
      });
    }
    this.setState({ showModalEliminar: false })
  }

  toggleDelete() {
    this.setState({ showModalEliminar: true });
  }

  saveEvento() {
    this.props.actions.updateEvento(this.state.evento);
    this.setState({ isEditing: false });
  }

  updateEventoState(field, value) {
    const evento = this.state.evento;
    evento[field] = value;
    return this.setState({ evento: evento });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.evento.id !== nextProps.evento.id) {
      this.setState({ evento: nextProps.evento });
    }
    this.setState({ saving: false, isEditing: false });
  }

  toggleMensajes() {
    this.props.history.push({
      pathname: '/actividades/mensajes',
      search: '?evento=' + this.state.evento.id,
    });
  }

  togglePatrocinadores() {
    this.props.history.push({
      pathname: '/actividades/patrocinadores',
      search: '?evento=' + this.state.evento.id,
    });
  }

  render() {
    if (this.state.isEditing) {
      return (
        <div>
          <h1>Editar evento</h1>
          <EventoForm
            evento={this.state.evento}
            rubros={this.props.rubrosEvento}
            onSave={this.saveEvento}
            onChange={this.updateEventoState}
            saving={this.state.saving}
          />
        </div>
      )
    } else if (this.state.evento.nombre) {
      const evento = this.state.evento;
      let listaContactos;
      if (evento.contacto.length > 0) {
        listaContactos = evento.contacto.map((contacto) =>
          <li className="list-group-item">{contacto.nombre} - {contacto.telefono}</li>
        );
      }
      return (
        <div className="col-md-8 col-md-offset-2">
          <h1>{evento.nombre}</h1>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-left">Descripción</b>
            </div>
            <div className="form-group col-md-6">
              <p>{evento.descripcion}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-left">Rubro</b>
            </div>
            <div className="form-group col-md-6">
              <p>{evento.rubro.nombre}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-left">Fecha de inicio</b>
            </div>
            <div className="form-group col-md-6">
              <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-left">Fecha de finalización</b>
            </div>
            <div className="form-group col-md-6">
              <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          {listaContactos ? (
            <div className="row">
              <div className="form-group col-md-6">
                <b name="contactos" className="float-left">Contactos</b>
              </div>
              <div className="form-group col-md-6">
                <ul className="list-group">{listaContactos}</ul>
              </div>
            </div>
          ) : undefined
          }
          <div className="row">
            <div className="form-group col-md-6">
              <b name="compartir" className="float-left">Compartir</b>
            </div>
            <div className="form-group col-md-6">
              <ButtonsCompartirEvento evento={this.state.evento} />
            </div>
          </div>
          <div className="btn-group form-group" role="group">
            <button
              onClick={this.toggleEdit}
              hidden={moment(evento.fecha_hora_inicio) <= moment()}
              className="btn btn-warning"
            >
              Editar evento
            </button>
            <button
              onClick={this.toggleEditNecesidades}
              hidden={moment(evento.fecha_hora_inicio) <= moment()}
              className="btn btn-warning"
            >
              Editar necesidades
            </button>
            <Link to={`/actividades/consultar-colaboraciones/${this.state.evento.id}`}>
              <button
                onClick={this.toggleConsultarColaboraciones}
                className="btn btn-warning"
              >
                Consultar colaboraciones
            </button>
            </Link>
            {/* Renderiza boton Ver album si empezo evento */}
            {this.props.evento.estado > 1 
                  ? (
                    <Link to={`/actividades/album/${this.props.evento.id}`}>
                      <button className="btn btn-warning">Ver álbum</button>
                    </Link>
                  ) 
                  : undefined}
            <button
              onClick={this.toggleMensajes}
              className="btn btn-warning"
            >
              Ver mensajes
            </button>
            <button
              onClick={this.togglePatrocinadores}
              className="btn btn-warning"
            >
              Ver patrocinadores
            </button>
          </div>
          <div className="form-group">
            <button
              onClick={this.toggleDelete}
              hidden={moment(evento.fecha_hora_inicio) <= moment()}
              className="btn btn-danger"
            >
              Eliminar evento
            </button>
          </div>
          <ModalEliminarItem open={this.state.showModalEliminar} nombre={this.state.evento.nombre}
            closeModal={this.confirmDeleteNecesidad} />
        </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
};

EventoView.propTypes = {
  evento: PropTypes.object.isRequired,
  rubrosEvento: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  let evento = {
    nombre: '',
    descripcion: '',
    rubro: {},
    fecha_hora_inicio: new Date(),
    fecha_hora_fin: new Date(),
    ubicacion: { latitud: '', longitud: '', notas: '' },
    contacto: [{
      nombre: '',
      mail: '',
      telefono: '',
      contactId: '1',
    }],
    nextId: '2'
  };
  const eventoId = ownProps.match.params.id;
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
    evento.rubro_id = evento.rubro.id;
    evento.nextId = evento.contacto.length + 1;
    for (let i = 0; i < evento.contacto.length; i++) {
      evento.contacto[i].contactId = i + 1;
    }
  }
  return { evento: evento, rubrosEvento: state.rubrosEvento };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(eventoActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventoView);