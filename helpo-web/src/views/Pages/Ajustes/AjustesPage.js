import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap'
import api from '../../../api';

class AjustesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordVerification: "",
      errors: {},
    }
    this.sendResetPasswordEmail = this.sendResetPasswordEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    const newPasswordVerification = this.state.newPasswordVerification;

    if (!oldPassword) {
      formIsValid = false;
      errors.oldPassword = 'Debe ingresar su contraseña';
    } else { errors.oldPassword = undefined; }

    if (!newPassword) {
      formIsValid = false;
      errors.newPassword = 'Debe ingresar su nueva contraseña';
    } else if (newPassword.length < 8) {
      formIsValid = false;
      errors.newPassword = 'Su nueva contraseña debe tener al menos 8 caracteres';
    } else if (newPassword === oldPassword) {
      formIsValid = false;
      errors.newPassword = 'Su nueva contraseña debe ser distinta a la actual';
    } else if (newPassword !== newPasswordVerification) {
      formIsValid = false;
      errors.newPassword = undefined;
      errors.newPasswordVerification = 'Sus contraseñas no coinciden';
    } else {
      errors.newPassword = undefined;
      errors.newPasswordVerification = undefined;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleSubmit() {
    this.setState({ passwordReseteada: undefined });
    if (this.handleValidation()) {
      const old_password = this.state.oldPassword;
      const new_password = this.state.newPassword;
      let headers = { "Content-Type": "application/json" };
      let body = JSON.stringify({ old_password, new_password });
      api.post("/auth/change_password/", body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              errors: {},
              exito: 'Su contraseña ha sido cambiada con éxito'
            })
          }
        }
        )
        .catch(
          e => {
            console.log(e.response);
            this.setState({
              errors: { oldPassword: 'Contraseña incorrecta' },
              exito: undefined
            })
          }
        );
    }
  }

  sendResetPasswordEmail() {
    let headers = { "Content-Type": "application/json" };
    api.get('/auth/user/', { headers })
      .then((res) => {
        const email = res.data.email;
        let body = JSON.stringify({ email });
        return api.post("/auth/reset_password/", body, { headers })
          .then(res => {
            if (res.status === 200) {
              this.setState({
                passwordReseteada: true,
                email: email
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
      })
      .catch((e) => {
        console.log(e.response);
      })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Cambie su contraseña
              </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <div className="row">
                  <div className="col-md-2">
                    <Label for="oldPassword">Contraseña actual</Label>
                  </div>
                  <div className="col-md-8">
                    <InputGroup className="mb-2">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input size="30" type="password" placeholder="Ingrese su contraseña" id="oldPassword"
                        onChange={(e) => this.setState({ oldPassword: e.target.value })} />
                    </InputGroup>
                    <span style={{ color: 'red' }}>{this.state.errors.oldPassword}</span>
                    {this.state.passwordReseteada ?
                      <span className="text-muted"> Se ha enviado un email a {this.state.email}</span>
                      : (this.state.errors.oldPassword === 'Contraseña incorrecta') ?
                        (this.state.passwordReseteada === false) ?
                          <span className="text-muted"> Se produjo un error al resetear su contraseña</span>
                          : <span className="text-muted"> ¿Olvidaste tu contraseña? Click <a style={{ textDecoration: "underline" }} onClick={this.sendResetPasswordEmail}>aquí</a></span>
                        : undefined}
                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="row">
                  <div className="col-md-2">
                    <Label for="newPassword">Nueva contraseña</Label>
                  </div>
                  <div className="col-md-8">
                    <InputGroup className="mb-2">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input size="30" type="password" placeholder="Ingrese su nueva contraseña" id="newPassword"
                        onChange={(e) => this.setState({ newPassword: e.target.value })} />
                    </InputGroup>
                    <span style={{ color: 'red' }}>{this.state.errors.newPassword}</span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="row">
                  <div className="col-md-2">
                    <Label for="newPasswordVerification">Confirme su contraseña</Label>
                  </div>
                  <div className="col-md-8">
                    <InputGroup className="mb-2">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input size="30" type="password" placeholder="Ingrese su nueva contraseña" id="newPasswordVerification"
                        onChange={(e) => this.setState({ newPasswordVerification: e.target.value })} />
                    </InputGroup>
                    <span style={{ color: 'red' }}>{this.state.errors.newPasswordVerification}</span>
                  </div>
                </div>
              </FormGroup>
            </Form>
            <div className="row">
              <div className="offset-md-2 col-md-8">
                <Button className="col-md-4" color="primary" onClick={this.handleSubmit}>Cambiar contraseña</Button>
                <span className="offset-md-1 col-md-3" style={{ color: 'green' }}>{this.state.exito}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default AjustesPage;