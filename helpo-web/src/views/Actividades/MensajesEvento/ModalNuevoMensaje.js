import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalNuevoMensaje extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>
          <ModalHeader>Nuevo mensaje</ModalHeader>
          <ModalBody>
            <textarea className="form-control" rows="4" onChange={this.props.updateMensaje  }
              value={this.props.mensaje} maxLength={1000} placeholder="Escribe tu mensaje..."
            />
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
