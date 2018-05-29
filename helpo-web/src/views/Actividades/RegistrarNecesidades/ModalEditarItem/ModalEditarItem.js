import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumericInput from 'react-numeric-input';
import api from '../../../../api';

class ModalEditarItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cantidad: 1,
      error: undefined,
      necesidad: {
        descripcion: "Descripción",
        recurso: {
          nombre: "Recurso",
          categoria: {
            nombre: "Categoría"
          }
        }
      }
    };
    this.handleCantidadChange = this.handleCantidadChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.necesidad) {
      api.get('/actividades/necesidades/' + this.props.necesidad + '/')
      .then(res => {
        const necesidadData = res.data;
        this.setState({ necesidad: necesidadData});
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
    }
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
                  <label>{this.state.necesidad.recurso.categoria.nombre}</label>
                </div>
              </div>
              <div className="col-md-6">
                <div>  
                  <strong>Recurso</strong>
                </div>
                <div>
                  <label>{this.state.necesidad.recurso.nombre}</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div>
                  <strong>Descripción</strong>
                </div>
                <div>
                  {this.state.necesidad.descripcion}
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
            <Button color="warning" onClick={this.handleSumbit}>Editar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(undefined)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalEditarItem;
