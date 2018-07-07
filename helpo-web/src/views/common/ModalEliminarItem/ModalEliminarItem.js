import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalEliminarItem extends Component {

  render() {
    const nombre = this.props.nombre ? this.props.nombre : undefined;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-danger'>
          <ModalHeader>Eliminar necesidad</ModalHeader>
          <ModalBody>
            <strong>¿Estás seguro que deseas eliminar {nombre}? </strong>
            Si lo confirmas, cualquier voluntario participante será notificado
            de la cancelación de su participación.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.props.closeModal(true)}>Eliminar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalEliminarItem;
