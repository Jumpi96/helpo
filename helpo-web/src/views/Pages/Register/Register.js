import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
import {auth} from "../../../actions";
import validateEmail from "../../../utils/ValidateEmail";


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      user_type: "voluntario",
      email: "",
      password: "",
      repeat: "",
      errors: {
        nombre: "",
        apellido: "",
        email: "",
        contraseña: "",
      }
    }
    this.handleUserTypeSelect = this.handleUserTypeSelect.bind(this);
    this.renderNameField = this.renderNameField.bind(this); 
    this.onSubmitData = this.onSubmitData.bind(this);
    this.renderErrorList = this.renderErrorList.bind(this);
  }

  onSubmitData() {    
    if (this.handleValidation()) {
      this.props.register(this.state.nombre, this.state.email,
                        this.state.user_type, this.state.password,
                        this.state.apellido);
    } else {
      // TODO
    }
  }

  handleUserTypeSelect(user_type) {
    switch(user_type) {
      case "voluntario": {
        this.setState({ user_type: "voluntario" });
        break;
      }
      case "ong": {
        this.setState({ user_type: "ong" });
        break;
      }
      case "empresa": {
        this.setState({ user_type: "empresa" });
        break;
      }
      default: {
        break;
      }
    }
  }

  handleValueChange(event, type) {
    switch(type) {
      case "nombre": {
        this.setState({ nombre: event.target.value });
        break;
      }
      case "apellido": {
        this.setState({ apellido: event.target.value });
        break;
      }
      case "email": {
        this.setState({ email: event.target.value });
        break;
      }
      case "password": {
        this.setState({ password: event.target.value });
        break;
      }
      case "repeat": {
        this.setState({ repeat: event.target.value });
        break;
      }
      default: {
        break;
      }
    }
  }

  renderNameField() {
    if (this.state.user_type === "voluntario") {
      return (
      <div>
        <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
               <InputGroupText>
                 <i className="icon-user"></i>
               </InputGroupText>
            </InputGroupAddon>
            <Input type="text" 
                 placeholder="Nombre" 
                 onChange={(e) => this.handleValueChange(e, "nombre")}/>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
               <i className="icon-user"></i>
            </InputGroupText>            
          </InputGroupAddon>
          <Input type="text" 
                 placeholder="Apellido" 
                 onChange={(e) => this.handleValueChange(e, "apellido")}/>          
        </InputGroup>
      </div>
      );
    }
    else {
      return (
        <div>
        <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
               <InputGroupText>
                 <i className="icon-user"></i>
               </InputGroupText>
            </InputGroupAddon>
          <Input type="text" 
                 placeholder="Nombre" 
                 onChange={(e) => this.handleValueChange(e, "nombre")}/>          
        </InputGroup>
        </div>
      )
    }
  }

  renderErrorList() {    
    var list = [];
    var ids = 0;
    for(var key in this.state.errors) {
      var value = this.state.errors[key]
       if (value !== "") { list.push((<li key={ids}><span style={{ color: 'red' }}>{value}</span></li>)) }
       ids = ids + 1; 
    }
    return list;
  }
  
  handleValidation() {
    const errors = {
      nombre: "",
      apellido: "",
      email: "",
      contraseña: "",
    };
    const noErrors = {
      nombre: "",
      apellido: "",
      email: "",
      contraseña: "",
    }; //Uso para chequear que no hubo errores
    //Nombre
    if (this.state.nombre === "") {
      errors.nombre = "Debe ingresar un nombre";
    }
    //Apellido
    if (this.state.user_type === "voluntario" && this.state.apellido === "") {
      errors.apellido = "Debe ingresar un apellido";
    }
    //Mail
    if (this.state.email === "") {
      errors.email = "Debe ingresar un email";
    }
    if (errors.email === "" && !validateEmail(this.state.email)) {
      errors.email = "Ingrese un email valido";
    }
    //Contraseña
    if (this.state.password === "" || this.state.repeat === "") {
      errors.contraseña = "Debe ingresar la contraseña en ambos campos";
    }
    if (errors.contraseña === "" && this.state.password !== this.state.repeat) {
      errors.contraseña = "La contraseña no coincide en ambos campos";
    }
    //End
    if (errors === noErrors) {
      return true;
    }
    this.setState({ errors: errors})
    return false;
  }

  render() {
    const user_type = this.state.user_type;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardHeader>
                  <Row>
                    <Col xs="12" sm="4">
                      <Button className={user_type === "voluntario" ? "btn-twitter" : "btn-secondary"} 
                              block
                              onClick={() => this.handleUserTypeSelect("voluntario")}
                              >
                              <span>Voluntario</span>
                      </Button>
                    </Col>
                    <Col xs="12" sm="4">
                      <Button className={user_type === "ong" ? "btn-twitter" : "btn-secondary"}  
                              block
                              onClick={() => this.handleUserTypeSelect("ong")}
                              >
                              <span>ONG</span>
                      </Button>
                    </Col>
                    <Col xs="12" sm="4">
                      <Button className={user_type === "empresa" ? "btn-twitter" : "btn-secondary"}  
                              block
                              onClick={() => this.handleUserTypeSelect("empresa")}
                              >
                              <span>Empresa</span>
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="p-4">
                  <h1>Registrar Usuario</h1>
                  <p className="text-muted">Cree su cuenta</p>
                  {this.renderNameField()}
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" 
                           placeholder="Email" 
                           onChange={(e) => this.handleValueChange(e, "email")}/>                    
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" 
                           placeholder="Password" 
                           onChange={(e) => this.handleValueChange(e, "password")}/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" 
                           placeholder="Repeat password" 
                           onChange={(e) => this.handleValueChange(e, "repeat")}/>                    
                  </InputGroup>
                  <Button color="success" onClick={() => this.onSubmitData()} block>Crear Cuenta</Button>                  
                  <ul>{this.renderErrorList()}
                  <div>
                    {this.props.errors.length > 0 && (
                      <div>
                        {this.props.errors.map(error => (
                          <li key={error.field}>
                            <span style={{ color: 'red' }}>{error.message}</span>
                          </li>
                        ))}                        
                      </div>                      
                    )}                    
                  </div>
                  </ul>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}


const mapStateToProps = state => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => {
      return {field, message: state.auth.errors[field]};
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

const mapDispatchToProps = dispatch => {
  return {
    register: (username, password) => dispatch(auth.register(username, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
