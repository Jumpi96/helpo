import React from 'react';  
import { PropTypes } from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import './Eventos.css';

class ConsultarEventosView extends React.Component {  
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
    return this.setState({evento: evento});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.evento.id !== nextProps.evento.id) {
      this.setState({evento: nextProps.evento});
    }
    this.setState({saving: false, isEditing: false});
  }

  render() {
    if (this.state.evento.nombre) {
      const evento = this.state.evento;
      let listaContactos;
      if (evento.contacto.length > 0) {
        listaContactos = evento.contacto.map((contacto) => 
          <li class="list-group-item">{contacto.nombre} - {contacto.telefono}</li>
        );
      }
      return (
        <div className="col-md-8 col-md-offset-2">
          <h1>{evento.nombre}</h1>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-right">Descripción</b>
            </div>
            <div className="form-group col-md-6">
              <p>{evento.descripcion}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-right">Rubro</b>
            </div>
            <div className="form-group col-md-6">
              <p>{evento.rubro.nombre}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-right">Fecha de inicio</b>
            </div>
            <div className="form-group col-md-6">
              <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <b className="float-right">Fecha de finalización</b>
            </div>
            <div className="form-group col-md-6">
            <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          {listaContactos ? (
            <div className="row">
              <div className="form-group col-md-6">
                <b name="contactos" className="float-right">Contactos</b>
              </div>
              <div className="form-group col-md-6">
                <ul class="list-group">{listaContactos}</ul>
              </div>
            </div>
            ) : undefined
          }
          <div class="btn-group form-group" role="group">
            <button 
              onClick={this.toggleEdit} 
              hidden={moment(evento.fecha_hora_inicio)<=moment()}
              className="btn btn-warning"
            >
              Editar evento
            </button>
            <button 
              onClick={this.toggleEditNecesidades} 
              hidden={moment(evento.fecha_hora_inicio)<=moment()}
              className="btn btn-warning"
            >
              Editar necesidades
            </button>
          </div>
          <div class="form-group">
            <button 
              onClick={this.toggleDelete} 
              hidden={moment(evento.fecha_hora_inicio)<=moment()}
              className="btn btn-danger"
            >
              Eliminar evento
            </button>
          </div>
          <ModalEliminarItem open={this.state.showModalEliminar} nombre={this.state.evento.nombre}
            closeModal={this.confirmDeleteNecesidad}/>
        </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
};

ConsultarEventosView.propTypes = {  
  evento: PropTypes.object.isRequired,
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
    for (let i=0; i < evento.contacto.length; i++) {
      evento.contacto[i].contactId = i+1;
    }
  }
  return {evento: evento};
}

function mapDispatchToProps(dispatch) {  
  return {
    actions: bindActionCreators(eventoActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarEventosView);