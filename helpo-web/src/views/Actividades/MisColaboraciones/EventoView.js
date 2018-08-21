import React from 'react';  
import { PropTypes } from 'prop-types';
import { Table } from 'reactstrap';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import { auth } from '../../../actions';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import './Eventos.css';

class EventoView extends React.Component {  
  constructor(props) {
    super(props);
    this.state = { 
      isEditing: false,
      evento: this.props.evento,
      saving: false,
      showModalEliminar: false
    }
    this.toggleDelete = this.toggleDelete.bind(this);
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
      pathname: '/actividades/consultar-evento?id=' + this.state.evento.id,
    });
  }

  toggleDelete() {
    this.setState({ showModalEliminar: true });
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
    return(
      <tbody>
        {listaNecesidades}
      </tbody>
    );
  }

  getTablaVoluntarios(voluntarios) {
    const voluntario = this.getFuncionVoluntario(voluntarios);
    if (voluntario) {
      return (
        <tr>
          <td><i className="cui-user"></i></td>
          <td>{voluntario.funcion.nombre}</td>
          <td>{voluntario.descripcion}</td>
        </tr>
      )
    }
  }

  getFuncionVoluntario(voluntarios) {
    let userId = this.getUserId();
    let filtroVoluntarios;
    for (let i = 0; i < voluntarios.length; i += 1) {
      filtroVoluntarios = voluntarios[i].participaciones.filter(p => p.voluntario_id === userId);
      if (filtroVoluntarios.length > 0) {
        return voluntarios[i];
      }
    }
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    let userId = this.getUserId();
    n.colaboraciones.forEach((c) => {
      if (c.voluntario.id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  render() {
    if (this.state.evento.nombre) {
      const evento = this.state.evento;
      const listaNecesidades = this.getTablaNecesidades(evento.necesidades);
      const listaVoluntarios = this.getTablaVoluntarios(evento.voluntarios);
      return (
        <div className="col-md-8 col-md-offset-2">
          <div className="row">
            <div className="form-group">
              <h1>{evento.nombre}</h1>
            </div>
          </div>
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
          </Table>
          {listaVoluntarios ?
            <Table responsive striped>
              <thead>
                <tr>
                  <th></th>
                  <th>Función</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {listaVoluntarios}
              </tbody>
            </Table> : undefined
          }
          <button
            onClick={this.toggleEdit}
            hidden={moment(evento.fecha_hora_inicio)<=moment()}
            className="btn btn-warning"
          >
            Editar colaboraciones
          </button>
          <button
            onClick={this.toggleView}
            hidden={moment(evento.fecha_hora_inicio)>moment()}
            className="btn btn-warning"
          >
            Comentar evento
          </button>
          <ModalEliminarItem open={this.state.showModalEliminar} nombre={this.state.evento.nombre}
            closeModal={this.confirmDeleteNecesidad}/>
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