import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import validateEmail from '../../../../utils/ValidateEmail'

class ModalEditarItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);

  }

  handleSubmit() {
    this.setState({error:''});
    if (this.handleValidation()) {
     this.props.closeModal(true);
    } 
  }

  handleValidation() { 
    this.setState({error:''});
    let formIsValid = true;
    var error = this.state.error;    
    if (this.props.contacto.nombre === "") {
        error = 'No puede ingresar un contacto sin nombre.';        
        formIsValid = false;
      }
    if (this.props.contacto.email === "" && this.props.contacto.telefono === "") {
        error += ' Debe ingresar un mail o un teléfono.';        
        formIsValid = false;
      }
    if (this.props.contacto.email !== "" && !validateEmail(this.props.contacto.email)) {
        error += ' Debe ingresar un mail válido.';        
        formIsValid = false;
    }
    else if (this.props.contacto.telefono !== '' && isNaN(this.props.contacto.telefono)) {
      error += ' Debe ingresar sólo números en el teléfono.';        
      formIsValid = false;
    }
    if (formIsValid) {
      error = '';
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

  handleNombreChange(event) {
    const contacto = this.props.contacto;
    contacto.nombre = event.target.value;
    this.props.handleChange(contacto);
  }

  handleEmailChange(event) {
    const contacto = this.props.contacto;
    contacto.email = event.target.value;
    this.props.handleChange(contacto);
  }

  handleTelefonoChange(event) {
    const contacto = this.props.contacto;
    contacto.telefono = event.target.value;
    this.props.handleChange(contacto);
  }

  render() {
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
                      value={this.props.contacto.nombre} 
                      onChange={this.handleNombreChange}
                    />
                  </div>
                  <div className="col-md-3">
                  <input type="text" 
                      name="email" className="form-control"
                      placeholder="Email"
                      value={this.props.contacto.email} 
                      onChange={this.handleEmailChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input type="text" 
                      name="telefono" className="form-control"
                      placeholder="Teléfono"
                      value={this.props.contacto.telefono} 
                      onChange={this.handleTelefonoChange}
                    />
                  </div>
                <div>
                  <span style={{color: "red"}}>{this.state.error}</span>
                </div>              
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="warning" onClick={this.handleSubmit}>Guardar</Button>{' '}
            <Button color="secondary" onClick={() => this.props.closeModal(false)}>Cancelar</Button>
          </ModalFooter>

        </Modal>
      </div>
    );
  }
}

export default ModalEditarItem;