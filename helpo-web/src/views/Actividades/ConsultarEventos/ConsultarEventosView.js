import React from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import { connect } from "react-redux";
import moment from 'moment';
import api from '../../../api';
import './Eventos.css';
import ong from '../../../assets/img/ong.png';
import { getImagen } from '../../../utils/Imagen';
import ComentariosEvento from './ComentariosEvento/ComentariosEvento';

class ConsultarEventosView extends React.Component {  

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      evento: { id }
    }
    this.toggleColaborar = this.toggleColaborar.bind(this);
    this.loadEvento = this.loadEvento.bind(this);
  }

  loadEvento() {
    api.get('/actividades/consulta_eventos/' + this.state.evento.id + '/')
      .then(res => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  componentDidMount() {
    this.loadEvento(); 
  }

  toggleColaborar() {
    this.props.history.push({ 
      pathname: '/actividades/registrar-colaboraciones', 
      search: '?evento=' + this.state.evento.id,
    });
  }

  esVoluntario() {
    if (this.props.auth.user) {
      return this.props.auth.user.user_type === 2;
    } else {
      return false;
    }
  }

  render() {
    if (this.state.evento.nombre) {
      const evento = this.state.evento;
      let listaContactos, listaNecesidades, listaVoluntarios;
      if (evento.necesidades.length > 0) {
        listaNecesidades = evento.necesidades.map((n) => 
          <tr>
            <td><i className={n.recurso.categoria.icono}></i></td>
            <td>{n.recurso.categoria.nombre}</td>
            <td>{n.recurso.nombre}</td>
            <td>{n.descripcion}</td>
            <td>{n.cantidad}</td>
          </tr> 
        );
      }
      if (evento.voluntarios.length > 0) {
        listaVoluntarios = evento.voluntarios.map((n) => 
          <tr>
            <td><i className="cui-user"></i></td>
            <td>{n.funcion.nombre}</td>
            <td>{n.descripcion}</td>
            <td>{n.cantidad}</td>
          </tr> 
        );
      }
      if (evento.contacto.length > 0) {
        listaContactos = evento.contacto.map((contacto) => 
          <li class="col-md-6 list-group-item">{contacto.nombre} - {contacto.email} - {contacto.telefono}</li>
        );
      }
      return (
        <div className="animated fadeIn">
          <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Colaborar en {evento.nombre} - {evento.organizacion.nombre}
          </CardHeader>
          <CardBody>
            <h1 id="titulo">
              <img
                src={getImagen(evento.organizacion ? evento.organizacion.avatar : ong )}
                alt={evento.organizacion.nombre}
                style={{width:'75px', height:'75px'}} 
              />
              {' ' + evento.nombre}
            </h1>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Descripción</b>
              </div>
              <div className="form-group col-md-9">
                <p>{evento.descripcion}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Rubro</b>
              </div>
              <div className="form-group col-md-9">
                <p>{evento.rubro.nombre}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de inicio</b>
              </div>
              <div className="form-group col-md-9">
                <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de finalización</b>
              </div>
              <div className="form-group col-md-9">
              <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            {listaContactos ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b name="contactos" className="float-right">Contactos</b>
                </div>
                <div className="form-group col-md-9">
                  <ul class="list-group">{listaContactos}</ul>
                </div>
              </div>
              ) : undefined
            }
            {listaNecesidades ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b className="float-right">Necesidades materiales</b>
                </div>
                <div className="form-group col-md-9">
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
                    <tbody>
                      {listaNecesidades}
                    </tbody>
                  </Table>
                </div>
              </div>
              ) : undefined
            }
            {listaVoluntarios ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b className="float-right">Voluntarios</b>
                </div>
                <div className="form-group col-md-9">
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Función</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaVoluntarios}
                    </tbody>
                  </Table>
                </div>
              </div>
              ) : undefined
            }
            {listaNecesidades || listaVoluntarios ? (
              <button 
                onClick={this.toggleColaborar}
                hidden={moment(evento.fecha_hora_inicio)<=moment() || !this.esVoluntario()}
                className="btn btn-warning offset-md-10"
              >
                Colaborar
              </button>
              ) : undefined
            }
            {moment(evento.fecha_hora_inicio)<=moment() && this.props.auth.user ? (
              <ComentariosEvento evento={evento} update={this.loadEvento} />
              ) : undefined
            }
          </CardBody>
        </Card>
      </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
};


const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}
  
export default connect(mapStateToProps, undefined)(ConsultarEventosView);