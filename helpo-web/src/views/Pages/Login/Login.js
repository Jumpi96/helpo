import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
import { auth } from "../../../actions";
import logo from '../../../assets/img/brand/logo_principal.svg' 
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  onSubmitGoogle(response) {        
    const nombre = response.profileObj.givenName;
    const email = response.profileObj.email;
    const password = response.profileObj.email;
    const user_type = 2;
    const apellido = response.profileObj.familyName;
    const id_token = response.tokenId;
    this.props.loginGoogle(nombre, email, password, user_type, apellido, id_token);
  }

  render() {
    const responseGoogle = (response) => {
      console.log("google console");
      console.log(response);
      this.onSubmitGoogle(response);
    }
    const responseFacebook = (response) => {
      console.log("facebook console");
      console.log(response);
      // this.signup(response, 'facebook');
    }
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    } else {
      return (
      <div className="container">
            <div className="panel-heading">
              <div className="panel-title text-center">
                <img src={logo} alt="Helpo" width="150" height="150"></img>
              </div>
            </div>

        <form onSubmit={this.onSubmit}>
              <Row className="justify-content-center">
                <CardGroup>
                    <Card className="p-5" col-md-6 col-xs-6>
                      <CardBody className="text-center">
                        <h1>Ingresar</h1>
                        <p className="text-muted">Ingresá con tu cuenta</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input className="Email" size="30" type="text" placeholder="Email" 
                            onChange={(e) => this.setState({email: e.target.value.toLowerCase()})}/>
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input size="30" type="password" placeholder="Contraseña"
                            onChange={(e) => this.setState({password: e.target.value})}/>
                        </InputGroup>
                            <Button color="primary" type="submit" className="px-4">¡Ingresá!</Button>
                      </CardBody>                      
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
                        clientId="93328850687-681u9fksr6g52g2bebbj1qu8thldgaq6.apps.googleusercontent.com"
                        buttonText="Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle} />
                      {/* <Button className="btn-google" block><span>Google</span></Button> */}
                    </Card>

                    <Card className="bg-primary p-5" col-md-6 col-xs-6>
                      <CardBody className="text-center">
                        <div>
                          <h1>Registrarse</h1>  
                          <p>¿No estás registrado todavía en <strong>helpo</strong>?</p>
                          <Button onClick={() => this.props.history.push('register')} 
                             color="primary">¡Regístrate!</Button>
                        </div>
                        <br />
                        <div>
                          {this.props.errors.length > 0 && (
                            <div>
                              {this.props.errors.map(error => (
                                <p key={error.field}>{error.message}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </CardGroup>
              </Row>
        </form>
      </div>
      );
    } 
  }
}


//<Col xs="6" className="text-right"> Boton para el Olvido su contraseña
//<Button color="link" className="px-0">¿Olvidaste tu contraseña?</Button>
//</Col>


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
    login: (email, password) => {
      return dispatch(auth.login(email, password));
    },
    loginGoogle: (nombre, email, password, user_type, apellido, id_token) => {
      return dispatch(auth.loginGoogle(nombre, email, password, user_type, apellido, id_token));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);