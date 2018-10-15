import React, { Component } from 'react';
import { ActionSheet, Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';
import api from '../../api';
import stylesPassword from './stylesPassword';

class ChangePassword extends Component {
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
      errors.newPassword = 'Su contraseña debe tener al menos 8 caracteres';
    } else if (newPassword === oldPassword) {
      formIsValid = false;
      errors.newPassword = 'Su contraseña debe ser distinta a la actual';
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
      <Container style={stylesPassword.container}>
        <Header>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate("Configuracion")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Contraseña</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Contraseña actual</Label>
              <Input secureTextEntry onChangeText={text => this.setState({ oldPassword: text })} />
            </Item>
            <Text style={stylesPassword.validationMessage}>{this.state.errors.oldPassword}</Text>
            {this.state.passwordReseteada ?
              <Text style={stylesPassword.suggestionMessage}> Se ha enviado un email a {this.state.email}</Text>
              : (this.state.errors.oldPassword === 'Contraseña incorrecta') ?
                (this.state.passwordReseteada === false) ?
                  <Text style={stylesPassword.suggestionMessage}> Se produjo un error al resetear su contraseña</Text>
                  : <Text onPress={this.sendResetPasswordEmail} style={stylesPassword.suggestionMessage}> ¿Olvidaste tu contraseña? Click aquí</Text>
                : undefined}
            <Item floatingLabel>
              <Label>Nueva contraseña</Label>
              <Input secureTextEntry onChangeText={text => this.setState({ newPassword: text })} />
            </Item>
            <Text style={stylesPassword.validationMessage}>{this.state.errors.newPassword}</Text>
            <Item floatingLabel last>
              <Label>Confirme su contraseña</Label>
              <Input secureTextEntry onChangeText={text => this.setState({ newPasswordVerification: text })} />
            </Item>
            <Text style={stylesPassword.validationMessage}>{this.state.errors.newPasswordVerification}</Text>
          </Form>
          <Button block style={{ margin: 15, marginTop: 50 }}
            onPress={this.handleSubmit} >
            <Text>Cambiar contraseña</Text>
          </Button>
          <Text style={stylesPassword.successMessage}>{this.state.exito}</Text>
        </Content>
      </Container>
    );
  }
}

export default ChangePassword;