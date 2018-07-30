import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import validateEmail from '../../../../utils/ValidateEmail'

class ModalEditarItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      nombre: this.props.contacto.nombre,
      email: this.props.contacto.email,
      telefono: this.props.contacto.telefono, 
      contactoModificado: {
        nombre:'',
        email:'',
        telefono:'',
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  handleSubmit() {
    this.setState({error: ''});
    if (this.handleValidation()) {
      
      this.setState({
        contactoModificado:{
        nombre:this.state.nombre,
        email:this.state.email,
        telefono:this.state.telefono
        }
      })
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
    if (this.state.mail === "" && this.state.telefono === "") {
        error += ' Debe ingresar un mail o un telefono';        
        formIsValid = false;
      }
    if (this.state.mail !== "" && !validateEmail(this.state.mail)) {
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
                      value={this.state.nombre} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                  <input type="text" 
                      name="email" className="form-control"
                      placeholder="Email"
                      value={this.state.email} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <input type="text" 
                      name="telefono" className="form-control"
                      placeholder="Teléfono"
                      value={this.state.telefono} 
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