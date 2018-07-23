/*
import React from 'react';
import PropTypes from 'prop-types';


const inputPropTypes = {
  contactNum: PropTypes.number.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  contactId: PropTypes.number.isRequired,
  onContactChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  contactValues: PropTypes.shape({
    nombre: PropTypes.string,
    email: PropTypes.string,
    telefono: PropTypes.number,
  }).isRequired,
};

function ContactoInput({
  contactNum, onClickRemove, contactId, onContactChange, onPhoneChange, contactValues,
}) {
  return (
    <div className="form-group">
      <h6>Contacto {contactNum}</h6>
      <label htmlFor={`nombre-contacto${contactId}`}>
        Nombre<br />
        <input
          type="text"
          placeholder="Nombre Apellido"
          id={`nombre-contacto${contactId}`}
          className="form-control"
          name="nombre"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.nombre}
        />
      </label> <br />
      <label htmlFor={`email-contacto${contactId}`}>
        email<br />
        <input
          type="email"
          placeholder="ejemplo@email.com"
          id={`email-contacto${contactId}`}
          className="form-control"
          name="email"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.email}
        />
      </label> <br />
      <label htmlFor={`telefono-contacto${contactId}`}>
        Telefono<br />
        <input
          type="telefono"
          placeholder="543515000555"
          id={`telefono-contacto${contactId}`}
          className="form-control"
          name="telefono"
          onChange={e => onPhoneChange(e, contactId)}
          value={contactValues.telefono}
        />
      </label> <br />
      <input
        type="button"
        value="Remover Contacto"
        className="btn btn-danger"
        onClick={() => onClickRemove(contactId)}
      />
    </div>
  );
}
ContactoInput.propTypes = inputPropTypes;

const registerPropTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,  
  onClickAdd: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onContactChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
};

class RegistrarContacto extends React.Component {
  displayInputs() {
    const inputs = [];
    for (let i = 1; i <= this.props.contacts.length; i += 1) {
      inputs.push(<ContactoInput
        contactNum={i}
        onClickRemove={this.props.onClickRemove}
        contactId={this.props.contacts[i - 1].contactId}
        onContactChange={this.props.onContactChange}
        onPhoneChange={this.props.onPhoneChange}
        contactValues={this.props.contacts[i - 1]}
      />);
    }
    return inputs || null;
  }

  render() {
    return (
      <div className="row">
        {this.displayInputs()}
        <input
          type="button"
          className="btn btn-secondary"
          value="Agregar Contacto"
          onClick={this.props.onClickAdd}
        />
      </div>
    );
  }
}
RegistrarContacto.propTypes = registerPropTypes;

export default RegistrarContacto;
*/



import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarContactos.css';
import api from '../../../../api';
import ModalEliminarItem from './ModalEliminarItem';
import ModalEditarItem from './ModalEditarItem';
import validateEmail from '../../../../utils/ValidateEmail'

class RegistrarContactos extends Component {
  constructor(props){
    super(props);
    /*const urlParams = new URLSearchParams(this.props.location.search)
    const parametro = urlParams.get('evento');
    let evento;
    if (parametro) {
      evento = parametro;
    } else {
      this.props.history.push({ pathname: '/dashboard' });
    }*/
    this.state = {
      contactos: [],
      nombre: '',
      email:'',
      telefo:'',
      contacto: undefined,      
      contactId: '1',    
      nextId: '2',
      showModalEliminar: false,
      showModalEditar: false,
      contactoModificado: {nombre: '', email: '', telefono: '' },
      contactoModificadoId: undefined,
      error:''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveCntacto = this.saveCntacto.bind(this);
    this.confirmDeleteContacto = this.confirmDeleteContacto.bind(this);
    this.deleteContacto = this.deleteContacto.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({error: ''});
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
          contacto:cont
        });
      this.props.actualizarContactos(this.state.contactos);
    }
  }

  saveCntacto(cont) { 
    
    if (cont !== undefined) {
      var contactosModificados = this.state.contactos;
      contactosModificados[this.state.contactoModificadoId]= cont;
      
      this.setState({
        showModalEditar: false,
        contactoModificado: undefined,
        contactos: contactosModificados
      });   
    this.props.actualizarContactos(this.state.contactos);      
    }
  }

  handleValidation() { 
    let formIsValid = true;
    var error = this.state.error;    
    if (this.state.nombre === "") {
        error = 'No puede ingresar un contacto sin nombre';        
        formIsValid = false;
      }
    if (this.state.email === "" && this.state.telefono === "") {
        error += ' Debe ingresar un mail o un telefono';        
        formIsValid = false;
      }
    if (this.state.email !== "" && !validateEmail(this.state.email)) {
        error += ' Debe ingresar un mail valido';        
        formIsValid = false;
    }
    this.setState({error: error});
    return formIsValid;      
  }

  

  editContacto(id) { 
    var contacto = this.state.contactos.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEditar: true,
      contactoModificado: contacto
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
    const contacto = this.state.contactos.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEliminar: true,
      contactoModificado: contacto
    });
    this.props.actualizarContactos(this.state.contactos);    
  }

  confirmDeleteContacto(res) {
    if (res){;
      var contactosModificados = this.state.contactos;
      var contactoMod = contactosModificados.splice(this.state.contactoModificadoId, 1);

      this.setState({ 
        contactos: contactosModificados,
        contactoModificado: contactoMod
      });
      this.props.actualizarContactos(this.state.contactos);
    }    
  }

  /*
    if (res) {
      api.delete('/actividades/contactos/' + this.state.contactoModificado.id + '/') //atento con el id
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadContactos();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
    }
    this.setState({
      contactoModificado: undefined,
      showModalEliminar: false
    })
  */


  // Carga de contactos 

  componentDidMount() {
    // this.loadContactos(); esto hacerlo para EDITAR EVENTO para registrar evento no hace falta
  }

  loadContactos() {
    api.get('/actividades/contactos/?evento=' + this.state.evento + '/') // ver si esta bien
      .then(res => {
        const contactosData = res.data;
        this.setState({ contactos: contactosData});
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
  }

  /*handleItemChange(r) {
    // eslint-disable-next-line
    this.setState({ email: parseInt(r) });
  }*/

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  getTablaContactos() {
    var contacts = this.state.contactos;
    if(contacts.length > 0){
      var tablaContactos = undefined;
      for (let c = 0; c <= contacts.length; c += 1) {
        tablaContactos +=
        <tr>
          <td>{contacts[c].nombre}</td>
          <td>{contacts[c].email}</td>
          <td>{contacts[c].telefono}</td>
          <td><Button onClick={() => this.editContacto(c)} outline // Atento a que no falle acá, porqu puede que tome elvalorde c para todas las filas y siempre edite el mismo contacto
            disabled={this.state.contacto} color="warning">Editar</Button></td>
          <td><Button onClick={() => this.deleteContacto(c)} outline  // Antes se usaba contactoModificadoId
            disabled={this.state.contacto} color="danger">Eliminar</Button></td>
        </tr>
      }
      return tablaContactos;
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
              <form onSubmit={this.handleSubmit}>
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
                    <Button outline type="submit" color="success" >Agregar</Button>
                  </div>
                </div>
                <span style={{color: "red"}}>{this.state.error}</span>
              </form>
            </div>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>                  
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {this.getTablaVoluntarios()}
              </tbody>
            </Table>
            {/*<Button onClick={() => this.props.history.push('dashboard')} 
              color="primary">Guardar contactos</Button>*/}
          </CardBody>
        </Card>
        <ModalEliminarItem open={this.state.showModalEliminar} contactoId={this.state.contactoModificadoId} contactos={this.state.contactos}
          closeModal={this.confirmDeleteContacto}/>
        <ModalEditarItem open={this.state.showModalEditar} contacto={this.state.contactoModificado} 
          closeModal={this.saveCntacto}/>
      </div>
    )
  }
}  
export default RegistrarContactos;