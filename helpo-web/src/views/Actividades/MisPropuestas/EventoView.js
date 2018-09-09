import React from 'react';  
import { PropTypes } from 'prop-types';
import { Table } from 'reactstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import { auth } from '../../../actions';
import * as eventoActions from '../../../actions/eventoActions';
import './Eventos.css';

class EventoView extends React.Component {  
  constructor(props) {
    super(props);
    this.state = { 
      evento: this.props.evento,
    }
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.confirmDeleteNecesidad = this.confirmDeleteNecesidad.bind(this);
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

  toggleEdit() {
    this.props.history.push({ 
      pathname: '/actividades/registrar-colaboraciones', 
      search: '?evento=' + this.state.evento.id,
    });
  }

  toggleView() {
    this.props.history.push({ 
      pathname: '/actividades/consultar-evento', 
      search: '?id=' + this.state.evento.id,
    });
  } 

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.evento.id !== nextProps.evento.id) {
      this.setState({evento: nextProps.evento});
    }
    this.setState({saving: false, isEditing: false});
  }

  getTablaNecesidades(necesidades) {
    const listaNecesidades = [];
    let cantidad;
    necesidades.forEach(n => {
      cantidad = this.getCantidadNecesidades(n);
      if (cantidad > 0) {
        listaNecesidades.push(
          <tr>
            <td><i className={n.recurso.categoria.icono}></i></td>
            <td>{n.recurso.categoria.nombre}</td>
            <td>{n.recurso.nombre}</td>
            <td>{n.descripcion}</td>
            <td>{cantidad}</td>
          </tr>
        )
      }
    });
    if (listaNecesidades.length > 0) {
      return(
        <tbody>
          {listaNecesidades}
        </tbody>
      );
    }
    return undefined;
  }

  getTablaVoluntarios(voluntarios) {
    const listaVoluntarios = [];
    let cantidad;
    voluntarios.forEach(n => {
      cantidad = this.getCantidadVoluntarios(n);
      if (cantidad > 0) {
        listaVoluntarios.push(
          <tr>
            <td><i className="cui-user"></i></td>
            <td>{n.funcion.nombre}</td>
            <td>{n.descripcion}</td>
            <td>{cantidad}</td>
          </tr>
        )
      }
    });
    if (listaVoluntarios.length > 0) {
      return(
        <tbody>
          {listaVoluntarios}
        </tbody>
      );
    }
    return undefined;
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    let userId = this.getUserId();
    n.colaboraciones.forEach((c) => {
      if (c.colaborador.id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  getCantidadVoluntarios(v) {
    let contador = 0;
    let userId = this.getUserId();
    v.participaciones.forEach((p) => {
      if (p.colaborador.id === userId) {
        contador += p.cantidad;
      };
    });
    return contador;
  }

  getPropuesta() {
    return this.state.evento.propuestas.filter(p => p.empresa === this.getUserId())[0];
  }

  getBotonEstado() {
    switch (this.getPropuesta().aceptado) {
      case 0:
        return (
          <button disabled className="btn btn-warning">Propuesta pendiente</button>
        );
      case 1:
        return (
          <button disabled className="btn btn-success">Propuesta aceptada</button>
        );
      case 2:
        return (
          <button disabled className="btn btn-danger">Propuesta rechazada</button>
        );
    }    
  }

  getComentario(propuesta) {
    if (propuesta.comentario === null) {
      return (
        <button
          onClick={this.toggleView}
          className="btn btn-warning"
        >
          Comentar evento
        </button>
      )
    } else {
      return (
        <div className="row">
          <div className="form-group col-md-4">
            <b className="float-right">Comentario de la ONG</b>
          </div>
          <div className="form-group col-md-8">
            <p>{propuesta.comentario}</p>
          </div>
        </div>
      )
    }
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  render() {
    if (this.state.evento.nombre) {
      const evento = this.state.evento;
      const propuesta = this.getPropuesta();
      const listaNecesidades = this.getTablaNecesidades(evento.necesidades);
      const listaVoluntarios = this.getTablaVoluntarios(evento.voluntarios);
      return (
        <div className="col-md-8 col-md-offset-2">
          <div className="row">
            <div className="form-group">
              <h1>{evento.nombre}</h1>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <b className="float-right">Fecha de propuesta</b>
            </div>
            <div className="form-group col-md-8">
              <p>{moment(propuesta.created).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <b className="float-right" name="estado">Estado</b>
            </div>
            <div className="form-group col-md-8">
              {this.getBotonEstado()}
            </div>
          </div>
          {listaNecesidades ?
            <Table responsive striped>
              <thead>
                <tr>
                  <th></th>
                  <th>Categoría</th>
                  <th>Ítem</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              {listaNecesidades}
            </Table> : undefined
          }
          {listaVoluntarios ?
            <Table responsive striped>
              <thead>
                <tr>
                  <th></th>
                  <th>Función</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              {listaVoluntarios}
            </Table> : undefined
          }
          <button
            onClick={this.toggleEdit}
            hidden={moment(evento.fecha_hora_inicio)>moment() || propuesta.aceptado === -1}
            className="btn btn-warning"
          >
            Editar colaboraciones
          </button>
          {
            moment(evento.fecha_hora_inicio)>moment() && propuesta.aceptado !== -1 ?
              this.getComentario(propuesta)
            : undefined
          }
          
        </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
};

EventoView.propTypes = {  
  evento: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {  
  let evento = {
    nombre: '',
    necesidades: [],
    voluntarios: [],
  };
  const eventoId = ownProps.match.params.id;
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
  }
  return {evento: evento, auth: state.auth};
}

function mapDispatchToProps(dispatch) {  
  return {
    actions: bindActionCreators(eventoActions, dispatch),
    loadUser: () => { return dispatch(auth.loadUser()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventoView);