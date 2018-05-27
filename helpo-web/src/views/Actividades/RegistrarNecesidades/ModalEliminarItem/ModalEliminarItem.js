import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import api from '../../../../api';

class ModalEliminarItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recurso: undefined
    };
  }

  componentDidUpdate() {
    api.get('/actividades/recursos/' + this.props.recurso + '/')
      .then(res => {
        const recursosData = res.data;
        this.setState({ recurso: recursosData.nombre });
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-danger'>
          <ModalHeader>Eliminar recurso</ModalHeader>
          <ModalBody>
            <strong>¿Estás seguro que deseas eliminar el recurso {this.state.recurso}? </strong>
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
