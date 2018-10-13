import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
//import {auth} from "../../../actions"; SE USA ABAJO - COMENTADO
import validateEmail from "../../../utils/ValidateEmail";
import api from "../../../api"
import ModalRegistroExitoso from './ModalRegistroExitoso';
import './Register.css';
import logo from '../../../assets/img/brand/logo_principal.svg';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { auth } from "../../../actions";
import { Redirect } from 'react-router-dom';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      user_type: "2",
      email: "",
      password: "",
      repeat: "",
      errors: {
        nombre: "",
        apellido: "",
        email: "",
        contraseña: "",
      },
      showModalRegistro: false,
      modalType: 'success'
    }
    this.handleUserTypeSelect = this.handleUserTypeSelect.bind(this);
    this.renderNameField = this.renderNameField.bind(this); 
    this.onSubmitData = this.onSubmitData.bind(this);
    this.renderErrorList = this.renderErrorList.bind(this);
    this.showModalRegistro = this.showModalRegistro.bind(this);
  }

  onSubmitData() {        
    if (this.handleValidation()) {
      const usuario = {
        nombre: this.state.nombre,
        email: this.state.email,
        password: this.state.password,
        user_type: this.state.user_type,
        apellido: this.state.apellido,
      }

      api.post('/auth/sign_up/', usuario)
      .then(res => {
        if(res.status === 200) {
          this.setState({
            showModalRegistro: true,
            modalType: 'success',
          })
        }
      }
      )
      .catch ( 
        res => {
          if(res.status !== 200) {
            this.setState({
              showModalRegistro: true,
              modalType: 'failure',
            })
          }
        }
      )
     // this.props.history.push('dashboard')
    } 
  }

  onSubmitGoogle(response) {        
    const nombre = response.profileObj.givenName;
    const email = response.profileObj.email;
    const password = response.profileObj.email;
    const user_type = this.state.user_type;
    const apellido = response.profileObj.familyName;
    const id_token = response.tokenId;
    this.props.loginGoogle(nombre, email, password, user_type, apellido, id_token);
  }

  onSubmitFacebook(response) {        
    const nombre = response.name;
    const email = response.email;
    const password = response.email;
    const user_type = this.state.user_type;
    const apellido = response.name;
    const id_token = response.accessToken;
    this.props.loginFacebook(nombre, email, password, user_type, apellido, id_token);
  }

  renderModal() {
    if (this.state.showModalRegistro) {
      if (this.state.modalType === "success") {
        return (
          <ModalRegistroExitoso
            title='¡Se ha registrado exitosamente en Helpo!'
            body='Revise su correo para activar su cuenta'
            onCancel={() => this.props.history.push('dashboard')}
          />)  
      }
      else {
        return (
          <ModalRegistroExitoso
            title='Error al registrarse en Helpo'
            body='Ya existe un usuario con ese mail'
            onCancel={() => {this.setState({ showModalRegistro: false })}}
          />
        )
      }      
    }
  }

  showModalRegistro() {
    this.setState({
      showModalRegistro: true,
    })
  }

  handleUserTypeSelect(user_type) {
    this.setState({
      errors:{
        nombre:'',
        apellido:'',
        email:'',
        contraseña:''
      },
    })
    switch(user_type) {
      case "voluntario": {
        this.setState({ user_type: "2", apellido: "" });
        break;
      }
      case "ong": {
        this.setState({ user_type: "1", apellido: "ong"  });
        break;
      }
      case "empresa": {
        this.setState({ user_type: "3", apellido: "empresa" });
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
        this.setState({ email: event.target.value.toLowerCase() });
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
    if (this.state.user_type === "2") {
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
    let isValid = true;
    
    //Nombre
    if (this.state.nombre === "") {
      errors.nombre = "Debe ingresar un nombre";
      isValid = false;
    }
    //Apellido
    if (this.state.user_type === "voluntario" && this.state.apellido === "") {
      errors.apellido = "Debe ingresar un apellido";
      isValid = false;
    }
    //Mail
    if (this.state.email === "") {
      errors.email = "Debe ingresar un email";
      isValid = false;
    }
    if (errors.email === "" && !validateEmail(this.state.email)) {
      errors.email = "Ingrese un email válido";
      isValid = false;
    }
    //Contraseña
    if (this.state.password.length < 8){
      errors.contraseña = "La contraseña debe tener al menos 8 dígitos"
      isValid = false; 
    }
    if (this.state.password === "" || this.state.repeat === "") {
      errors.contraseña = "Debe ingresar la contraseña en ambos campos";
      isValid = false;
    }
    if (errors.contraseña === "" && this.state.password !== this.state.repeat) {
      errors.contraseña = "La contraseña no coincide en ambos campos";
      isValid = false;
    }    
    //End
    if (isValid) {
      return isValid;
    }
    this.setState({ errors: errors})
    return isValid;
  }

  render() {
    const user_type = this.state.user_type;
    const responseGoogle = (response) => {
      if(response && response.profileObj) {
        this.onSubmitGoogle(response);
      }
    }
    const responseFacebook = (response) => {
      if(response && response.email) {
        this.onSubmitFacebook(response);
      }
    }
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    } else {
    return (
      <body>
		    <div className="container">
				  <div className="panel-heading">
	          <div className="panel-title text-center">
              <img src={logo} alt="Helpo" width="150" height="150"></img>
	          </div>
	        </div>
	      </div> 
        <div>
          <Container>
            <Row className="justify-content-center">
              <Col md="6">
                <Card className="mx-4" style={{width: '100%'}}>
                  <CardHeader>
                   <Row>
                      <Col xs="12" sm="4">
                        <Button className={user_type === "2" ? "btn-warning" : "btn-primary"} 
                                block
                                onClick={() => this.handleUserTypeSelect("voluntario")}
                                >
                                <span>Voluntario</span>
                        </Button>
                      </Col>
                      <Col xs="12" sm="4">
                        <Button className={user_type === "1" ? "btn-warning" : "btn-primary"}  
                                block
                                onClick={() => this.handleUserTypeSelect("ong")}
                                >
                                <span>ONG</span>
                        </Button>
                      </Col>
                      <Col xs="12" sm="4">
                        <Button className={user_type === "3" ? "btn-warning" : "btn-primary"}  
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
                      <Input 
                             className="Email"
                             type="text" 
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
                             placeholder="Contraseña" 
                             onChange={(e) => this.handleValueChange(e, "password")}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" 
                            placeholder="Repetir contraseña" 
                            onChange={(e) => this.handleValueChange(e, "repeat")}/>                    
                    </InputGroup>
                    <Button color="primary" onClick={() => this.onSubmitData()} block>Crear Cuenta</Button>                  
                    <ul>{this.renderErrorList()}</ul>
                  </CardBody>
                  <CardFooter style={{padding: '1.5rem', textAlign: 'center', display: 'block'}}>
                        <FacebookLogin
                          appId="343119846258901"
                          autoLoad={false}
                          fields="name,email,picture"
                          callback={responseFacebook}
                          render={renderProps => (
                            <Button onClick={renderProps.onClick} className="btn-facebook" block><span>Facebook</span></Button>
                          )} />
                        {/* <Button className="btn-facebook" block><span>Facebook</span></Button> */}
                        <GoogleLogin 
                          className="btn-google"
                          clientId="93328850687-681u9fksr6g52g2bebbj1qu8thldgaq6.apps.googleusercontent.com"
                          buttonText="Google"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle} />
                        {/* <Button className="btn-google" block><span>Google</span></Button> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        {this.renderModal()}
        </div>
		<script type="text/javascript" src="assets/js/bootstrap.js"></script>
	  </body>
    );
  }
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

//NO SACAR POR LAS DUDAS
/*const mapDispatchToProps = dispatch => {
  return {
    register: (username, password) => dispatch(auth.register(username, password)),
  };
}*/
const mapDispatchToProps = dispatch => {
  return {
    loginGoogle: (nombre, email, password, user_type, apellido, id_token) => {
      return dispatch(auth.loginGoogle(nombre, email, password, user_type, apellido, id_token));
    },
    loginFacebook: (nombre, email, password, user_type, apellido, id_token) => {
      return dispatch(auth.loginFacebook(nombre, email, password, user_type, apellido, id_token));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
