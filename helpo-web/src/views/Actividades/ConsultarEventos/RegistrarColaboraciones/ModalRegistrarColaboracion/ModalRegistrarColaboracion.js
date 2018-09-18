import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumericInput from 'react-numeric-input';

class ModalRegistrarColaboracion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
    };
    this.handleCantidadChange = this.handleCantidadChange.bind(this);
    this.handleComentariosChange = this.handleComentariosChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCantidadChange(cantidad) {
    const colaboracion = this.props.colaboracion;
    colaboracion.cantidad = cantidad;
    this.props.handleChange(colaboracion);
  }

  handleComentariosChange(event) {
    const colaboracion = this.props.colaboracion;
    colaboracion.comentarios = event.target.value;
    this.props.handleChange(colaboracion);
  }

  getInfoCategorias() {
    if (this.props.colaboracion) {
      if (this.props.colaboracion.funcion) {
        return (
          <div className="row">
            <div className="col-md-6">
              <div>
                <strong>Función</strong>
              </div>
              <div>
                <label>{this.props.colaboracion.funcion.nombre}</label>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="row">
            <div className="col-md-6">
              <div>
                <strong>Categoría</strong>
              </div>
              <div>
                <label>{this.props.colaboracion.recurso.categoria.nombre}</label>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <strong>Recurso</strong>
              </div>
              <div>
                <label>{this.props.colaboracion.recurso.nombre}</label>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  handleSubmit() {
    if (this.handleValidation()) {
      this.props.closeModal(true);
      this.setState({ error: undefined });
    }
  }

  handleCancel() {
    this.props.closeModal(false);
    this.setState({ error: undefined });
  }

  handleValidation() {
    let formIsValid = true;
    let error = this.state.error;
    const cantidad = this.props.colaboracion.funcion ? 1 : this.props.colaboracion.cantidad;

    if (cantidad <= 0) {
      formIsValid = false;
      error = 'La cantidad ingresada no es válida.';
    } else if (this.props.colaboracion.cantidad_restante < cantidad) {
      formIsValid = false;
      error = 'La cantidad ingresada es mayor al cupo disponible';
    }

    this.setState({ error });
    return formIsValid;
  }

  getTitulo() {
    if (this.props.colaboracion.funcion) {
      return 'Registrando participación';
    } else {
      if (this.props.colaboracion.cantidadAnterior > 0) {
        return 'Modificando colaboración';
      } else {
        return 'Registrando colaboración';
      }
    }
  }

  render() {
    if (this.props.colaboracion) {
      const descripcion = this.props.colaboracion.descripcion;
      const titulo = this.getTitulo();
      return (
        <div className="animated fadeIn">
          <Modal isOpen={this.props.open}
            className='modal-warning'>
            <ModalHeader>{titulo}</ModalHeader>
            <ModalBody>
              {this.getInfoCategorias()}
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
              {!this.props.colaboracion.funcion ?
                <div className="row">
                  <div className="col-md-6">
                    <div>
                      <strong>Cantidad</strong>
                    </div>
                    <div>
                      <NumericInput className="form-control" min="1"
                        value={this.props.colaboracion.cantidad} onChange={this.handleCantidadChange} />
                    </div>
                  </div>
                </div> : undefined
              }
              <div className="row">
                <div className="col-md-12">
                  <div>
                    <strong>Comentarios</strong>
                  </div>
                  <div>
                    <input className="form-control"
                      value={this.props.colaboracion.comentarios} onChange={this.handleComentariosChange} />
                    <span style={{ color: "red" }}>{this.state.error}</span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onClick={this.handleSubmit}>Guardar</Button>{' '}
              <Button color="secondary" onClick={this.handleCancel}>Cancelar</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ModalRegistrarColaboracion;
