import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumericInput from 'react-numeric-input';

class ModalEditarItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      contactos: this.props.contactos,
      contactoId: this.props.contactoId
    };
    this.handleCantidadChange = this.handleCantidadChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const cantidad = nextProps.contacto ? nextProps.contacto.cantidad : 1;
    return {error: undefined, cantidad: cantidad};
  }

  handleCantidadChange(cantidad) {
    this.setState({ cantidad: cantidad });
  }

  handleSubmit() {
    if (this.handleValidation()) {
      this.props.closeModal(this.state.cantidad);
    }
  }

  handleValidation() {
    return true;
  }

  render() {
    const nombre = this.props.contacto ? this.props.contacto.nombre : undefined;
    const email = this.props.contacto ? this.props.contacto.email : undefined;
    const telefono = this.props.contacto ? this.props.contacto.telefono : undefined;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>
          <ModalHeader>Editar contacto</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-4">
                <div>
                  <strong>Nombre</strong>
                </div>
                <div>
                  <label>{this.props.contactos}</label>
                </div>
              </div>
              <div className="col-md-4">
                <div>  
                  <strong>e-Mail</strong>
                </div>
                <div>
                  <label>{email}</label>
                </div>
              </div>            
              <div className="col-md-4">
                <div>
                  <strong>Teléfono</strong>
                </div>
                <div>
                  {telefono}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <strong>Cantidad</strong>
                </div>
                <div>
                  <NumericInput className="form-control" min="1"
                    value={this.state.cantidad} onChange={this.handleCantidadChange}/>
                  <span style={{color: "red"}}>{this.state.error}</span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={this.handleSubmit}>Editar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(undefined)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalEditarItem;
