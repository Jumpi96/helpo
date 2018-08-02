import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalRegistroExitoso extends Component {

  render() {
    // const nombre = this.props.nombre ? this.props.nombre : undefined;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal'>
          <ModalHeader>Eliminar contacto</ModalHeader>
          <ModalBody>
            <strong>Se ha registrado exitosamente en Helpo!</strong>
            \nEsperamos ansiosos, que pueda empezara disfrutar de la plataforma.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.props.history.push('noAuth/dashboard')}>Aceptar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalRegistroExitoso;
