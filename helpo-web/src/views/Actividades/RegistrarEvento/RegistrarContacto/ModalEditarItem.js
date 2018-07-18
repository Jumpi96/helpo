import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import NumericInput from 'react-numeric-input';

class ModalEditarItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      contactoModificado: this.props.contacto,
      contactos: this.props.contactos
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
      this.props.closeModal(this.state.contactoModificado);
    }
  }

  handleValidation() {
    let formIsValid = true;
    var error = this.state.error;    
    if (this.state.nombre === "") {
        error = 'No puede ingresar un contacto sin nombre';        
        formIsValid = false;
      }
    if (contactos[i].mail === "" && contactos[i].telefono === "") {
        error += ' Debe ingresar un mail o un telefono';        
        formIsValid = false;
      }
    if (contactos[i].mail !== "" && !validateEmail(contactos[i].mail)) {
        error += ' Debe ingresar un mail valido';        
        formIsValid = false;
    }
    this.setState({error: error});
    return formIsValid;      
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  render() {
    //const nombre = this.props.contacto ? this.props.contacto.nombre : undefined;
    //const email = this.props.contacto ? this.props.contacto.email : undefined;
    //const telefono = this.props.contacto ? this.props.contacto.telefono : undefined;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open}
          className='modal-warning'>

          <ModalHeader>Editar contacto</ModalHeader>

          <ModalBody>
            <div className="row">            
                  <div className="col-md-3">
                  <input type="text" 
                      name="nombre" className="form-control"
                      placeholder="Nombre"
                      value={this.state.contactoModificado.nombre} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                  <input type="text" 
                      name="email" className="form-control"
                      placeholder="email"
                      value={this.state.contactoModificado.email} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input type="text" 
                      name="telefono" className="form-control"
                      placeholder="Teléfono"
                      value={this.state.contactoModificado.telefono} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                <div>
                  <span style={{color: "red"}}>{this.state.error}</span>
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
