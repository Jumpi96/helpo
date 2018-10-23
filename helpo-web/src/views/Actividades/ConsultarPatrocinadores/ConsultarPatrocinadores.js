import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ModalPropuesta from './ModalPropuesta.js';
import api from '../../../api';
import './ConsultarPatrocinadores.css';

class ConsultarPatrocinadores extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const parametro = urlParams.get('evento');
    let evento;
    if (parametro) {
      evento = parametro;
    } else {
      this.props.history.push({ pathname: '/dashboard' });
    }
    this.state = {
      evento: { id: evento },
      propuestaModal: undefined,
      confirmRechazo: undefined,
      comentario: undefined
    };
    this.loadEvento = this.loadEvento.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleComentario = this.handleComentario.bind(this);
  }

  loadEvento() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
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

  getTablaPropuestas(propuestas) {
    const listaPropuestas = propuestas.map((p) =>
      <tr>
        <td><label>{p.empresa.nombre}</label></td>
        <td><Link to={'/perfil/' + p.empresa.id}><Button>Ver perfil</Button></Link></td>
        <td><label>{moment(p.created).format('DD/MM/YYYY HH:mm')}</label></td>
        <td>{this.getBotonEstado(p)}</td>
        <td>
          <button 
            className="btn btn-primary"
            onClick={() => this.setState({ propuestaModal: p })}>
            Ver propuesta
          </button>
        </td>
      </tr>
    );
    if(propuestas.length > 0){
      return (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Empresa</th>
              <th></th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listaPropuestas}
          </tbody>
        </Table>
      );
    }
  else{
    return(
      <CardBody>
        <br />
        <label>No se recibieron propuestas para esta actividad</label>
      </CardBody>
    );
  }
    
  }

  getBotonEstado(propuesta) {
    switch (propuesta.aceptado) {
      case 0:
        return (
          <button disabled className="btn btn-warning">Propuesta pendiente</button>
        );
      case 1:
        return (
          <button disabled className="btn btn-success">Propuesta aceptada</button>
        );
      case -1:
        return (
          <button disabled className="btn btn-danger">Propuesta rechazada</button>
        );
      default:
        return undefined;
    }
  }

  handleCloseModal(respuesta) {
    const propuesta = this.state.propuestaModal;
    if (respuesta === 1) {      
      propuesta.aceptado = 1;
      api.put('/actividades/propuestas/' + propuesta.id + '/', propuesta)
        .then((res) => {
          this.loadEvento();
        })
        .catch((error) => {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
        })
    } else if (respuesta === -1) {
      if (this.state.confirmRechazo) {
        const { comentario } = this.state;
        if (comentario) {
          propuesta.aceptado = -1;
          propuesta.comentario = comentario;
          api.put('/actividades/propuestas/' + propuesta.id + '/', propuesta)
            .then((res) => {
              this.loadEvento();
            })
            .catch((error) => {
              if (error.response) { console.log(error.response.status) }
              else { console.log('Error: ', error.message) }
            })    
        } else {
          return;
        }
      } else {
        this.setState({ confirmRechazo: true });
        return;
      }
    }
    this.setState({
      confirmRechazo: undefined,
      comentario: undefined,
      propuestaModal: undefined
    })
  }

  handleComentario(e) {
    this.setState({ comentario: e.target.value })
  }

  render() {
    const { evento } = this.state;
    if (evento.nombre) {
      return (
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Administración de patrocinadores de {evento.nombre}
            </CardHeader>
            <CardBody>
              <form>
                <p>Desde aquí puede <b>aceptar o rechazar</b> las propuestas de patrocinación de las empresas para la actividad social.</p>
                {this.getTablaPropuestas(evento.propuestas)}
              </form>
            </CardBody>
          </Card>
          <ModalPropuesta 
            evento={this.state.evento}
            propuesta={this.state.propuestaModal}
            closeModal={this.handleCloseModal}
            comentario={this.state.comentario}
            handleComentario={this.handleComentario}
            confirmRechazo={this.state.confirmRechazo}
          />
        </div>
      )
    } else {
      return (<p>Cargando...</p>)
    }
  }
}

export default ConsultarPatrocinadores;