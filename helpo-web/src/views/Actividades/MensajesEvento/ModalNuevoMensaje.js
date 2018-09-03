import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalNuevoMensaje extends Component {

  constructor(props) {
    super(props);
    this.handleChangeAsunto = this.handleChangeAsunto.bind(this);
    this.handleChangeMensaje = this.handleChangeMensaje.bind(this);
  }

  handleChangeAsunto(e) {
    this.props.updateMensaje(e.target.value, this.props.mensaje);
  }

  handleChangeMensaje(e) {
    this.props.updateMensaje(this.props.asunto, e.target.value);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>
          <ModalHeader>Nuevo mensaje</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label for="asunto">Asunto</label>
              <input className="form-control" name="asunto" 
                onChange={this.handleChangeAsunto} 
                value={this.props.asunto}
              />
            </div>
            <div className="form-group">
              <label for="mensaje">Mensaje</label>
              <textarea className="form-control" rows="4"
                onChange={this.handleChangeMensaje} 
                value={this.props.mensaje} maxLength={1000} placeholder="Escribe tu mensaje..."
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => this.props.closeModal(true)}>Enviar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalNuevoMensaje;
