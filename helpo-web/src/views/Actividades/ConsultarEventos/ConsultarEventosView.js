import React from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Gmaps, Marker } from 'react-gmaps';
import moment from 'moment';
import api from '../../../api';
import './Eventos.css';
import ong from '../../../assets/img/ong.png';
import { getImagen } from '../../../utils/Imagen';
import ComentariosEvento from './ComentariosEvento/ComentariosEvento';
import ButtonsCompartirEvento from '../../common/ButtonsCompartir/ButtonsCompartirEvento';
import ButtonGoAlbum from '../ConsultarEventos/AlbumImagenes/ButtonGoAlbum'

class ConsultarEventosView extends React.Component {

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      evento: { id },
    }
    this.toggleColaborar = this.toggleColaborar.bind(this);
    this.loadEvento = this.loadEvento.bind(this);
    this.puedeColaborar = this.puedeColaborar.bind(this);
  }

  loadEvento() {
    api.get('/actividades/consulta_eventos/' + this.state.evento.id + '/')
      .then(res => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  componentDidMount() {
    this.loadEvento();
  }

  getPropuestas(propuestas) {
    const listaPropuestas = [];
    propuestas = this.shuffle(propuestas);
    propuestas.forEach((p) => {
      if (p.aceptado === 1) {
        listaPropuestas.push(
          <div className="row">
            <img
              src={getImagen(p.empresa.avatar)}
              alt="ONG"
              style={{ width: '50px', height: '50px' }}
            />
            <Link to={"/perfil/" + p.empresa.id} className="nombreEmpresa">
              <a >{p.empresa.nombre}</a>
            </Link>
          </div>
        )
      }
    })
    return (
      <div className="row">
        <div className="form-group col-md-2 offset-md-1">
          <b className="float-left">Empresas patrocinadoras</b>
        </div>
        <div className="form-group col-md-9">
          {listaPropuestas}
        </div>
      </div>
    )
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  toggleColaborar() {
    this.props.history.push({
      pathname: '/actividades/registrar-colaboraciones',
      search: '?evento=' + this.state.evento.id,
    });
  }

  esONG() {
    if (this.props.auth.user) {
      return this.props.auth.user.user_type === 1;
    } else {
      return false;
    }
  }

  puedeColaborar() {
    const { user } = this.props.auth;
    if (user) {
      if (user.user_type === 2) {
        return true;
      } else if (user.user_type === 3) {
        const propuestas_rechazadas = this.state.evento.propuestas.filter(p => p.empresa.id === user.id && p.aceptado === -1);
        if (propuestas_rechazadas.length === 0) {
          return true;
        }
      }
    }
    return false;
  }

  getHorarios(evento) {
    if (evento.campaña && evento.horarios.length > 0) {
      const listaHorarios = [];
      evento.horarios.forEach((h) => {
        listaHorarios.push(
          <div className="row">
            <div className="col-md-2">
              <p>{h[0]}</p>
            </div>
            <div className="col-md-2">
              <p>{h[1] + " - " + h[2]}</p>
            </div>
          </div>
        )
      })
      return (
        <div className="row">
          <div className="form-group col-md-2 offset-md-1">
            <b className="float-left">Horarios de atención</b>
          </div>
          <div className="form-group col-md-9">
            {listaHorarios}
          </div>
        </div>
      );
    }
  }

  render() {
    if (this.state.evento.nombre) {
      const evento = this.state.evento;
      const params = { v: '3.exp', key: process.env.GOOGLE_API_KEY };
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
          <li className="col-md-6 list-group-item">{contacto.nombre} - {contacto.email} - {contacto.telefono}</li>
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
                  src={getImagen(evento.organizacion ? evento.organizacion.avatar : ong)}
                  alt={evento.organizacion.nombre}
                  style={{ width: '75px', height: '75px' }}
                />
                {evento.campaña ? " Campaña" : " Evento"}{" - " + evento.nombre}
              </h1>
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b className="float-left">Descripción</b>
                </div>
                <div className="form-group col-md-9">
                  <p>{evento.descripcion}</p>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b className="float-left">Rubro</b>
                </div>
                <div className="form-group col-md-9">
                  <p>{evento.rubro.nombre}</p>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b className="float-left">Fecha de inicio</b>
                </div>
                <div className="form-group col-md-9">
                  <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b className="float-left">Fecha de finalización</b>
                </div>
                <div className="form-group col-md-9">
                  <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
                </div>
              </div>
              {this.getHorarios(evento)}
              {listaContactos ? (
                <div className="row">
                  <div className="form-group col-md-2 offset-md-1">
                    <b name="contactos" className="float-left">Contactos</b>
                  </div>
                  <div className="form-group col-md-9">
                    <ul className="list-group">{listaContactos}</ul>
                  </div>
                </div>
              ) : undefined
              }
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b className="float-left">Ubicación</b>
                </div>
                <div className='col-md-9'>
                  <Gmaps
                    width={'75%'}
                    height={'300px'}
                    lat={evento.ubicacion.latitud}
                    lng={evento.ubicacion.longitud}
                    zoom={12}
                    params={params}>
                    <Marker
                      lat={evento.ubicacion.latitud}
                      lng={evento.ubicacion.longitud}
                    />
                  </Gmaps>
                  <p style={{ marginTop: '10px' }}>{evento.ubicacion.notas}</p>
                </div>
              </div>
              {evento.propuestas.length > 0 && this.getPropuestas(evento.propuestas)}
              {listaNecesidades ? (
                <div className="row">
                  <div className="form-group col-md-2 offset-md-1">
                    <b className="float-left">Necesidades materiales</b>
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
                  <div className="form-group col-md-2 offset-md-1">
                    <b className="float-left">Voluntarios</b>
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
              {this.puedeColaborar() ? (
                <button
                  onClick={this.toggleColaborar}
                  hidden={
                    (moment(evento.fecha_hora_inicio) <= moment() && !evento.campaña) ||
                    (evento.campaña && (moment(evento.fecha_hora_fin) <= moment()))
                  }
                  className="btn btn-warning offset-md-10"
                >
                  {this.props.auth.user.user_type === 2 ? "Colaborar" : "Patrocinar"}
                </button>
              ) : undefined
              }
              {moment(evento.fecha_hora_inicio) <= moment() && this.props.auth.user ? (
                <ComentariosEvento evento={evento} update={this.loadEvento} />
              ) : undefined
              }
              {/* Renderiza boton Ver album si empezo evento */}
              {this.state.evento.estado > 1
                ? (
                  <div className="row">
                    <div className="form-group col-md-2 offset-md-1">
                      <b name="compartir" className="float-left">Album</b>
                    </div>
                    <div className="form-group col-md-9">
                      <ButtonGoAlbum eventoId={this.state.evento.id} />
                    </div>
                  </div>)
                : undefined}
              <div className="row">
                <div className="form-group col-md-2 offset-md-1">
                  <b name="compartir" className="float-left">Compartir</b>
                </div>
                <div className="form-group col-md-9">
                  <ButtonsCompartirEvento evento={this.state.evento} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    } else {
      return <div className="loader"/>
    }
  }
};


const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, undefined)(ConsultarEventosView);
