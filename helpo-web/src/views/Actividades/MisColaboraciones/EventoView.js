import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { auth } from '../../../actions';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import './Eventos.css';
import { Link } from 'react-router-dom'
import ButtonsCompartirEvento from '../../common/ButtonsCompartir/ButtonsCompartirEvento';

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
      pathname: '/actividades/consultar-evento',
      search: '?id=' + this.state.evento.id,
    });
  }

  toggleDelete() {
    this.setState({ showModalEliminar: true });
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.evento.id !== nextProps.evento.id) {
      this.setState({ evento: nextProps.evento });
    }
    this.setState({ saving: false, isEditing: false });
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
      return (
        <tbody>
          {listaNecesidades}
        </tbody>
      );
    }
    return undefined;
  }

  getTablaVoluntarios(voluntarios) {
    const listaVoluntarios = [];
    voluntarios.forEach(v => {
      if (this.esParticipante(v)) {
        listaVoluntarios.push(
          <tr>
            <td><i className="cui-user"></i></td>
            <td>{v.funcion.nombre}</td>
            <td>{v.descripcion}</td>
          </tr>
        )
      }
    });
    if (listaVoluntarios.length > 0) {
      return (
        <tbody>
          {listaVoluntarios}
        </tbody>
      );
    }
    return undefined;
  }

  getFuncionVoluntario(voluntarios) {
    let userId = this.getUserId();
    let filtroVoluntarios;
    for (let i = 0; i < voluntarios.length; i += 1) {
      filtroVoluntarios = voluntarios[i].participaciones.filter(p => p.colaborador.id === userId);
      if (filtroVoluntarios.length > 0) {
        return voluntarios[i];
      }
    }
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

  esParticipante(v) {
    return v.participaciones.filter(p => p.colaborador.id === this.getUserId()).length > 0;
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
              <Link to={'/actividades/consultar-evento?id=' + evento.id}>
                <h1>{evento.nombre}</h1>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-5">
              <b className="float-left">Fecha de inicio</b>
            </div>
            <div className="form-group col-md-7">
              <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-5">
              <b className="float-left">Fecha de finalización</b>
            </div>
            <div className="form-group col-md-7">
              <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-5">
              <b name="compartir" className="float-left">Compartir</b>
            </div>
            <div className="form-group col-md-7">
              <ButtonsCompartirEvento evento={this.state.evento} />
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
                </tr>
              </thead>
              {listaVoluntarios}
            </Table> : undefined
          }
          <button
            onClick={this.toggleEdit}
            hidden={moment(evento.fecha_hora_inicio) <= moment()}
            className="btn btn-warning"
          >
            Editar colaboraciones
          </button>
          {!evento.campaña || (evento.campaña && moment(evento.fecha_hora_inicio) > moment()) ?
            <Link style={{ marginLeft: 10 }} to={`/actividades/consultar-evento?id=${evento.id}`}>
              <Button color="warning">
                {evento.campaña ? "Ver campaña" : "Ver evento"}
              </Button>
            </Link> : undefined
          }
          <button
            onClick={this.toggleView}
            hidden={moment(evento.fecha_hora_inicio) > moment()}
            className="btn btn-warning"
          >
            Comentar evento
          </button>
          <ModalEliminarItem open={this.state.showModalEliminar} nombre={this.state.evento.nombre}
            closeModal={this.confirmDeleteNecesidad} />
        </div>
      );
    } else {
      return <div className="loader"/>
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
  return { evento: evento, auth: state.auth };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(eventoActions, dispatch),
    loadUser: () => { return dispatch(auth.loadUser()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventoView);