import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumericInput from 'react-numeric-input';

class ModalEditarItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      cantidad: 1
    };
    this.handleCantidadChange = this.handleCantidadChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const cantidad = nextProps.necesidad ? nextProps.necesidad.cantidad : 1;
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
    const categoria = this.props.necesidad ? this.props.necesidad.recurso.categoria.nombre : undefined;
    const recurso = this.props.necesidad ? this.props.necesidad.recurso.nombre : undefined;
    const descripcion = this.props.necesidad ? this.props.necesidad.descripcion : undefined;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>
          <ModalHeader>Editar necesidad</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <strong>Categoría</strong>
                </div>
                <div>
                  <label>{categoria}</label>
                </div>
              </div>
              <div className="col-md-6">
                <div>  
                  <strong>Recurso</strong>
                </div>
                <div>
                  <label>{recurso}</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div>
                  <strong>Descripción</strong>
                </div>
                <div>
                  {descripcion}
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
