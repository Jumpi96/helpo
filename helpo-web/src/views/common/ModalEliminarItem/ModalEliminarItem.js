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
            <strong>¿Est&aacute; seguro que desea eliminar {nombre}? </strong>
            Si lo confirma, cualquier voluntario participante ser&aacute; notificado
            de la cancelaci&oacute;n de su participaci&oacute;n.
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
