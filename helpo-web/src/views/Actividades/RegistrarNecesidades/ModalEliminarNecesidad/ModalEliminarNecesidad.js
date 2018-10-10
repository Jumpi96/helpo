import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalEliminarNecesidad extends Component {

  render() {
    let nombre;
    if (this.props.necesidad) {
      if (this.props.necesidad.funcion) {
        nombre = this.props.necesidad.funcion.nombre;
      } else {
        nombre = this.props.necesidad.recurso.nombre;
      }
    }
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-danger'>
          <ModalHeader>Eliminar necesidad</ModalHeader>
          <ModalBody>
            <strong>¿Está seguro que desea eliminar {nombre}? </strong>
            Si lo confirma, cualquier voluntario participante será notificado
            de la cancelación de su participación.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.props.closeModal(this.props.necesidad.id)}>Eliminar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(0)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalEliminarNecesidad;
