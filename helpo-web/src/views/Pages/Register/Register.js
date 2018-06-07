import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
import {auth} from "../../../actions";


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
  }

  onSubmit = (e) => {
    e.preventDefault();
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
          <Input type="text" placeholder="Nombre" />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
               <i className="icon-user"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="text" placeholder="Apellido" />
        </InputGroup>    
      </div>
      );
    }
    else {
      return (
        <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
               <InputGroupText>
                 <i className="icon-user"></i>
               </InputGroupText>
            </InputGroupAddon>
          <Input type="text" placeholder="Nombre" />
        </InputGroup>
      )
    }
  }

  handleValidation() {
    const errors = {
      nombre: "",
      apellido: "",
      email: "",
      contraseña: "",
    };
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
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  {this.renderNameField()}
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Email" />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Password" />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Repeat password" />
                  </InputGroup>
                  <Button color="success" block>Create Account</Button>
                  <div>
                    {this.props.errors.length > 0 && (
                      <ul>
                        {this.props.errors.map(error => (
                          <li key={error.field}>{error.message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
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
