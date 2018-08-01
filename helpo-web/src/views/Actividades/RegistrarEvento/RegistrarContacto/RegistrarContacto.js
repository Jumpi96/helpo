import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarContacto.css';
import ModalEliminarItem from './ModalEliminarItem';
import ModalEditarItem from './ModalEditarItem';
import validateEmail from '../../../../utils/ValidateEmail'

class RegistrarContacto extends Component {
  constructor(props){
    super(props);
    this.state = {
      contactos: this.props.contacts,
      nombre: '',
      email: '',
      telefono: '',
      contacto: undefined,      
      contactId: '1',    
      nextId: '2',
      showModalEliminar: false,
      showModalEditar: false,
      contactoModificadoId: undefined,
      contactoModificado: {
        nombre:'',
        email:'',
        telefono:''  
      },
      error: ''
    };
    this.handleAgregar = this.handleAgregar.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveCntacto = this.saveCntacto.bind(this);
    this.confirmDeleteContacto = this.confirmDeleteContacto.bind(this);
    this.deleteContacto = this.deleteContacto.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.editContacto = this.editContacto.bind(this);
    this.cleancontacto = this.cleancontacto.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
  }

  handleAgregar(event) {
    event.preventDefault();
    this.setState({error:''});
    var contacto = undefined;
    if (this.handleValidation()) {
      contacto = {        
        nombre: this.state.nombre,
        email: this.state.email,
        telefono: this.state.telefono
      };
      var contacts = this.state.contactos;
      var cont = contacts.push(contacto);
        this.setState({
          contactos: contacts, // Y seteamos estado
          contacto:cont,
          nombre: '',
          email: '',
          telefono: ''
        });
      this.props.actualizarContactos(contacts);
    }
  }

  handleValidation() {
    this.setState({error:''}); 
    let formIsValid = true;
    var error = this.state.error;    
    if (this.state.nombre === "") {
        error = 'No puede ingresar un contacto sin nombre';        
        formIsValid = false;
      }
    else if (this.state.email === "" && this.state.telefono === "") {
        error += ' Debe ingresar un mail o un telefono';        
        formIsValid = false;
      }
    else if (this.state.email !== "" && !validateEmail(this.state.email)) {
        error += ' Debe ingresar un mail valido';        
        formIsValid = false;
    }
    else if (this.state.telefono !== '' && isNaN(this.state.telefono)) {
      error += ' Debe ingresar solo números en el teléfono';        
      formIsValid = false;
    }
    this.setState({error: error});
    return formIsValid;      
  }

  saveCntacto(guardar) { 
    if (guardar) {
      var contactosModificados = this.state.contactos;
      var id = this.state.contactoModificadoId
      var contactoAModificar = this.state.contactoModificado;
      contactosModificados[id]= contactoAModificar;      
      this.setState({
        contactos: contactosModificados,
        showModalEditar: false,
        contactoModificado:{
          nombre:'',
          email:'',
          telefono:''
        },        
      });   
    this.props.actualizarContactos(this.state.contactos);      
    }
    else{
      this.setState({
        showModalEditar:false,
        contactoModificado:{
          nombre:'',
          email:'',
          telefono:''
        }
      })
    }
  }

  editContacto(id) { 
    var contacts = this.state.contactos;
    var contacto = contacts[id];
    this.setState({ 
      contactoModificadoId:id,
      contactoModificado:{
        nombre:contacto.nombre,
        email:contacto.email,
        telefono:contacto.telefono
      },
      showModalEditar: true
    });
  }

  cleancontacto() {
    this.setState({
      nombre: '',
      telefono: '',
      email: '',
      contacto: undefined
    });
  }

  // Delete contacto

  deleteContacto(id) {
    var contacts = this.state.contactos;
    var contacto = contacts[id];
    this.setState({ 
      showModalEliminar: true,
      contactoModificado: contacto,
      contactoModificadoId: id
    });
    this.props.actualizarContactos(this.state.contactos);    
  }

  confirmDeleteContacto(res) {
    if (res){
      var contactosModificados = this.state.contactos;
      var contactoMod = contactosModificados.splice(this.state.contactoModificadoId, 1);

      this.setState({ 
        contactos: contactosModificados,
        contactoModificado: contactoMod,
        contactoModificadoId: undefined,
        showModalEliminar: false
      });
      this.props.actualizarContactos(this.state.contactos);
    } 
    else{
      this.setState({ 
        showModalEliminar: false
      });
    }   
  }

  // Carga de contactos 
  componentDidMount() {
    // this.loadContactos(); esto hacerlo para EDITAR EVENTO para registrar evento no hace falta
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleModalChange(contacto) {
    this.setState({ contactoModificado: contacto });
  }

  getTablaContactos() { // Ver ayuda de juan del dia martes 24 de Julio con foto 
    var contacts = this.state.contactos;
    if(contacts.length > 0){
      var tablaContactos = [];
      for (let c = 0; c < contacts.length; c += 1) {
        tablaContactos.push(
          <tr> 
            <td><i></i></td>
            <td>{contacts[c].nombre}</td>
            <td>{contacts[c].email}</td>
            <td>{contacts[c].telefono}</td>
            <td><Button onClick={() => this.editContacto(c)} outline
               color="warning">Editar</Button></td>
            <td><Button onClick={() => this.deleteContacto(c)} outline 
               color="danger">Eliminar</Button></td>
          </tr>   
        )
      }
      return(
        <tbody>
          {tablaContactos}
        </tbody>
        )
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Agregue las personas a las que se pueda contactar por el evento
          </CardHeader>
          <CardBody>
            <div className="form-group">
              <form onSubmit={this.handleAgregar}>
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
                  <div className="col-md-3">
                    <Button outline type="button" onClick={this.handleAgregar} color="success" >Agregar</Button>
                  </div>
                </div>
                <span style={{color: "red"}}>{this.state.error}</span>
              </form>
            </div>
            <Table responsive striped>
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>                  
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              
                  {this.getTablaContactos()}
              
            </Table>
            {/*<Button onClick={() => this.props.history.push('dashboard')} 
              color="primary">Guardar contactos</Button>*/}
          </CardBody>
        </Card>
        <ModalEliminarItem open={this.state.showModalEliminar} contacto={this.state.contactoModificado} contactoId={this.state.contactoModificadoId} contactos={this.state.contactos}
          closeModal={this.confirmDeleteContacto}/>
        <ModalEditarItem open={this.state.showModalEditar} contacto={this.state.contactoModificado}  handleChange={this.handleModalChange}
          closeModal={this.saveCntacto}/>
      </div>
    )
  }
}  
export default RegistrarContacto;