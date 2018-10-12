import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalConfirmarEdicion extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>
          <ModalHeader>Editar propuesta aceptada</ModalHeader>
          <ModalBody>
            <strong>¿Estás seguro que deseas editar tu propuesta? </strong>
            Si lo confirmas, la propuesta volverá a un estado pendiente. Si la ONG no acepta
            la nueva propuesta, se eliminirá el patrocinio.
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => this.props.closeModal(true)}>Editar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalConfirmarEdicion;
