import React, { Component } from 'react';
import { Table, Card, CardHeader, CardBody, Modal, ModalFooter, ModalHeader, Button, ModalBody } from 'reactstrap';
import moment from 'moment';
import ModalNuevoMensaje from './ModalNuevoMensaje';
import api from '../../../api';


class ListadoMensajes extends Component {
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
      evento,
      mensajes: [],
      mensaje: '',
      asunto: '',
      openModal: false,
      openModalExitoso: false
    };
    this.confirmNuevoMensaje = this.confirmNuevoMensaje.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadMensajes = this.loadMensajes.bind(this);
  }

  componentDidMount() {
    this.loadMensajes();
  }

  loadMensajes() {
    api.get('/actividades/mensajes/?evento=' + this.state.evento)
      .then((res) => {
        this.setState({ mensajes: res.data });
      })
      .catch((e) => {
        this.props.history.push({ pathname: '/dashboard' });
      })
  }

  getListaMensajes() {
    if (this.state.mensajes.length > 0) {
      return this.state.mensajes.map((n) =>
        <tr>
          <td><i className="cui-envelope-letter"></i></td>
          <td>{moment(n.created).format("DD/MM/YYYY HH:mm")}</td>
          <td>{n.asunto}</td>
          <td>{n.mensaje}</td>
        </tr>
      );
    }
    return (
      <tr>
        <td></td>
        <td></td>
        <td>No se han enviado mensajes en este evento.</td>
      </tr>
    )
  }

  confirmNuevoMensaje(enviar) {
    const mensaje = {
      asunto: this.state.asunto,
      mensaje: this.state.mensaje,
      evento_id: this.state.evento,
    }
    if (enviar) {
      api.post('/actividades/mensajes/', mensaje)
        .then((res) => {
          this.setState({ openModalExitoso: true });
          this.loadMensajes();
        })
        .catch((e) => {
          this.setState({ error: "El mensaje ingresado no es válido." })
        })
    }
    this.setState({ openModal: false, mensaje: '', asunto: '' })
  }

  handleInput(asunto, mensaje) {
    this.setState({ asunto, mensaje });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Mensajes de evento
          </CardHeader>
          <CardBody>
            <form>
              <p>Los mensajes son enviados a <b>todos los voluntarios</b> registrados en el evento. Si un voluntario se anota posteriormente al envío del mensaje, <b>también recibirá</b> una copia del mismo.</p>
              <p>Una <b>copia del mensaje</b> será enviada a su correo electrónico.</p>
              <button className="btn btn-primary" type="button"
                onClick={() => this.setState({ openModal: true })}
              >
                <span className="cui-envelope-letter"></span> Nuevo mensaje
              </button>
              <br />
              <span style={{ color: 'red' }}>{this.state.error}</span>
              <hr />
              <Table responsive striped>
                <thead>
                  <tr>
                    <th></th>
                    <th>Fecha</th>
                    <th>Asunto</th>
                    <th>Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {this.getListaMensajes()}
                </tbody>
              </Table>
            </form>
          </CardBody>
        </Card>
        <ModalNuevoMensaje open={this.state.openModal} mensaje={this.state.mensaje} asunto={this.state.asunto}
          closeModal={this.confirmNuevoMensaje} updateMensaje={this.handleInput} />
        <Modal isOpen={this.state.openModalExitoso}>
          <ModalHeader>Mensaje enviado</ModalHeader>
          <ModalBody>
            Su mensaje ha sido enviado con éxito.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.setState({ openModalExitoso: false })}>Aceptar</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ListadoMensajes;