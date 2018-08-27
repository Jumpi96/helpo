import React from 'react';
import { PropTypes } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import EventoForm from './EventoForm';
import './Eventos.css';
import MetaTags from 'react-meta-tags';

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
  }

  toggleEdit() {
    this.setState({ isEditing: true });
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
          <li class="list-group-item">{contacto.nombre} - {contacto.telefono}</li>
        );
      }
      return (
        <div className="col-md-8 col-md-offset-2">
          <MetaTags>
            {
              // Cambiar
              // La misma URL que se comparta debe tener los siguientes meta tags
            }
            <meta property="og:url" content={"https://www.helpo.com.ar/#/actividades/evento/" + evento.id} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={"Helpo: " + evento.nombre} />
            <meta property="og:description" content={evento.descripcion} />
            <meta property="og:image" content="https://i.imgur.com/GyVKBfQ.jpg" />
          </MetaTags>
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
                <ul class="list-group">{listaContactos}</ul>
              </div>
            </div>
          ) : undefined
          }
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
          <div className="btn-group form-group" role="group">
            {
              // Facebook - Cambiar
            }
            <a target="_blank" rel="noopener noreferrer"
              href={"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2F" +
                "actividades%2Fevento%2F" + evento.id}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png"
                alt="Compartir en Facebook" width="40" height="40" facebook-share-dialog="true" />
            </a>
            {
              // Twitter - Cambiar
            }
            <a target="_blank" rel="noopener noreferrer"
              href={"http://twitter.com/share?text=Sumate%20a%20mi%20evento%20en%20Helpo%3A%20" + evento.nombre +
                "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" + evento.id + "&hashtags=Helpo"}>
              <img src="https://seeklogo.com/images/T/twitter-2012-negative-logo-5C6C1F1521-seeklogo.com.png"
                alt="Compartir en Twitter" width="40" height="40" />
            </a>
            {
              // Google+ - Cambiar
            }
            <a target="_blank" rel="noopener noreferrer"
              href={"https://plus.google.com/share?url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" + evento.id}>
              <img src="https://i.ebayimg.com/images/g/jqIAAOSwnHZYX128/s-l1600.jpg"
                alt="Compartir en Google+" width="40" height="40" />
            </a>
            {
              // LinkedIn - Cambiar
            }
            <a target="_blank" rel="noopener noreferrer"
              href={"https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" +
                evento.id + "&summary=Sumate%20a%20mi%20evento%20en%20Helpo%3A%20" + evento.nombre + "&source=Helpo"}>
              <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-linkedin-512.png"
                alt="Compartir en LinkedIn" width="40" height="40" />
            </a>
          </div>
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