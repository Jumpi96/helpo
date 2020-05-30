import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
import { auth } from "../../../actions";
import logo from '../../../assets/img/brand/logo_principal.svg'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import api from "../../../api"
import ModalRegistroExitoso from '../Register/ModalRegistroExitoso';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showModalRegistro: false,
      modalType: 'success',
      emailEnviado: undefined,
      passwordReseteada: undefined,
    }
    this.showModalRegistro = this.showModalRegistro.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
    this.sendResetPasswordEmail = this.sendResetPasswordEmail.bind(this);
  }

  exists(url, nombre, email, password, user_type, apellido, id_token) {
    let headers = { "Content-Type": "application/json" };
    let body = JSON.stringify({ nombre, email, password, user_type, apellido, id_token });
    api.post(url, body, { headers })
      .then(res => {
        if (res.status === 200) {
          if (url === "/auth/exists_google/") {
            this.props.loginGoogle(nombre, email, password, user_type, apellido, id_token);
          } else if (url === "/auth/exists_facebook/") {
            this.props.loginFacebook(nombre, email, password, user_type, apellido, id_token);
          }
        }
      }
      )
      .catch(
        e => {
          if (e.response.status === 404 || e.response.status === 400) {
            this.setState({
              showModalRegistro: true,
              modalType: "success",
            });
          } else {
            this.setState({
              showModalRegistro: true,
              modalType: "failure",
            });
          }
        }
      );
  }

  onSubmit = (e) => {
    this.setState({ passwordReseteada: undefined });
    if (this.props.isVerificationError) {
      this.setState({ emailEnviado: undefined });
    }
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
    const url = "/auth/exists_google/";
    this.exists(url, nombre, email, password, user_type, apellido, id_token);
  }

  onSubmitFacebook(response) {
    const nombre = response.name;
    const email = response.email;
    const password = response.email;
    const user_type = 2;
    const apellido = response.name;
    const id_token = response.accessToken;
    const url = "/auth/exists_facebook/";
    this.exists(url, nombre, email, password, user_type, apellido, id_token);
  }

  renderModal() {
    if (this.state.showModalRegistro) {
      if (this.state.modalType === "success") {
        return (
          <ModalRegistroExitoso
            body='Debe seleccionar su tipo de usuario'
            onCancel={() => this.props.history.push('register')}
          />)
      }
      else {
        return (
          <ModalRegistroExitoso
            body='Error al iniciar sesión'
            onCancel={() => { this.setState({ showModalRegistro: false }) }}
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

  sendVerificationEmail() {
    const email = this.state.email;
    let headers = { "Content-Type": "application/json" };
    let body = JSON.stringify({ email });
    api.post("/send_verification_email/", body, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            emailEnviado: true,
          })
        }
      }
      )
      .catch(
        e => {
          console.log(e.response);
          this.setState({
            emailEnviado: false,
          })
        }
      );
  }

  sendResetPasswordEmail() {
    const email = this.state.email;
    let headers = { "Content-Type": "application/json" };
    let body = JSON.stringify({ email });
    api.post("/auth/reset_password/", body, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            passwordReseteada: true,
          })
        }
      }
      )
      .catch(
        e => {
          console.log(e.response);
          this.setState({
            passwordReseteada: false,
          })
        }
      );
  }

  render() {
    const responseGoogle = (response) => {
      if (response && response.profileObj) {
        this.onSubmitGoogle(response);
      }
    }
    const responseFacebook = (response) => {
      if (response && response.email) {
        this.onSubmitFacebook(response);
      }
    }
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    } else {
      return (
        <div className="container">
          <div className="panel-heading">
            <div className="panel-title text-center" style={{ margin: '20px' }}>
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
                        onChange={(e) => this.setState({ email: e.target.value.toLowerCase() })} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input size="30" type="password" placeholder="Contraseña"
                        onChange={(e) => this.setState({ password: e.target.value })} />
                    </InputGroup>
                    <div>
                      {this.state.passwordReseteada ?
                        <div>
                          <p className="text-muted">Se ha enviado un email a {this.state.email}</p>
                        </div>
                        : (this.props.errors.length > 0 && !this.props.isVerificationError) ?
                          (this.state.passwordReseteada === false) ?
                            <div>
                              <p className="text-muted">El email ingresado no existe.</p>
                            </div>
                            :
                            <div>
                              <p className="text-muted">¿Olvidaste tu contraseña? Click <a style={{ textDecoration: "underline" }} onClick={this.sendResetPasswordEmail}>aquí</a></p>
                            </div>
                          : undefined}
                    </div>
                    <Button color="primary" type="submit" className="mb-4 px-4">¡Ingresá!</Button>
                    <FacebookLogin
                      appId="343119846258901"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={responseFacebook}
                      render={renderProps => (
                        <Button onClick={renderProps.onClick} className="btn-facebook mb-2 px-2" block><span>Facebook</span></Button>
                      )} />
                    {/* <Button className="btn-facebook" block><span>Facebook</span></Button> */}
                    <GoogleLogin
                      className="btn-google mb-2 px-2"
                      clientId="93328850687-681u9fksr6g52g2bebbj1qu8thldgaq6.apps.googleusercontent.com"
                      buttonText="Google"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle} />
                    {/* <Button className="btn-google" block><span>Google</span></Button> */}
                  </CardBody>
                </Card>

                <Card className="bg-primary p-5" col-md-6 col-xs-6>
                  <CardBody className="text-center">
                    <div>
                      <h1>Registrarse</h1>
                      <p>¿No estás registrado todavía en <strong>Helpo</strong>?</p>
                      <Button onClick={() => this.props.history.push('register')}
                        color="primary">¡Regístrate!</Button>
                    </div>
                    <br />
                    <div>
                      {this.props.errors.length > 0 && (
                        <div>
                          {this.props.errors.map(error => (
                            <p className="row text-center" key={error.field}>{error.message}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      {(this.props.isVerificationError && this.state.emailEnviado === undefined) ?
                        <p className="row text-center">Para enviar el correo de verificación, haga click&#160;<a style={{ color: "#FFFFFF" }} onClick={this.sendVerificationEmail}>aquí</a></p>
                        : undefined}
                    </div>
                    <div>
                      {this.state.emailEnviado ?
                        <p className="row text-center">Correo de verificación enviado.</p>
                        : (this.state.emailEnviado === false) ?
                          <p className="row text-center">El email ingresado no existe.</p>
                          : undefined}
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Row>
          </form>
          {this.renderModal()}
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
      return { field, message: state.auth.errors[field] };
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated,
    isVerificationError: state.auth.isVerificationError
  };
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => {
      return dispatch(auth.login(email, password));
    },
    loginGoogle: (nombre, email, password, user_type, apellido, id_token) => {
      return dispatch(auth.loginGoogle(nombre, email, password, user_type, apellido, id_token));
    },
    loginFacebook: (nombre, email, password, user_type, apellido, id_token) => {
      return dispatch(auth.loginFacebook(nombre, email, password, user_type, apellido, id_token));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);