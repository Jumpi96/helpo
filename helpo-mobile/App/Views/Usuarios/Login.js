
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionSheet, Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';

import styles from './styles';
import { login, loginGoogleFacebook } from '../../Redux/actions/auth'
import api from '../../api';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isSigninInProgress: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    GoogleSignin.configure({
      webClientId: '93328850687-681u9fksr6g52g2bebbj1qu8thldgaq6.apps.googleusercontent.com'
    });
  }

  preLoginGoogleFacebook = async (url, nombre, email, password, user_type, apellido, id_token) => {
    const auth = this.props.auth;
    this.props.loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      this.props.navigation.navigate("LaunchScreen");
    }
  };

  existsGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token) {
    let headers = { "Content-Type": "application/json" };
    let body = JSON.stringify({ nombre, email, password, user_type, apellido, id_token });
    api.post(url, body, { headers })
      .then(res => {
        if (res.status === 200) {
          if (url === "/auth/exists_google/") {
            var newUrl = "/auth/google/";
            this.preLoginGoogleFacebook(newUrl, nombre, email, password, user_type, apellido, id_token);
          } else if (url === "/auth/exists_facebook/") {
            var newUrl = "/auth/facebook/";
            this.preLoginGoogleFacebook(newUrl, nombre, email, password, user_type, apellido, id_token);
          }
        }
      }
      )
      .catch(
        e => {
          if (e.response.status === 404 || e.response.status === 400) {
            ActionSheet.show(
              {
                options: [
                  { text: "Volver", icon: "close", iconColor: "#25de5b" }
                ],
                cancelButtonIndex: 0,
                title: "Debe seleccionar su tipo de usuario"
              },
              buttonIndex => {
                this.props.navigation.navigate('SignUp')
              });
          } else {
            console.log(e);
          }
        }
      );
  }

  onSubmitGoogle(userInfo) {
    const nombre = userInfo.user.givenName;
    const email = userInfo.user.email;
    const password = userInfo.user.email;
    const user_type = 2;
    const apellido = userInfo.user.familyName;
    const id_token = userInfo.idToken;
    const url = "/auth/exists_google/";
    this.existsGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
  }

  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ isSigninInProgress: false });
      console.log(userInfo);
      this.onSubmitGoogle(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({ isSigninInProgress: false });
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({ isSigninInProgress: true });
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({ isSigninInProgress: false });
        console.log(error);
      } else {
        this.setState({ isSigninInProgress: false });
        console.log(error);
      }
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    const auth = this.props.auth;
    this.props.login(this.state.email, this.state.password);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      this.props.navigation.navigate("LaunchScreen");
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate("LaunchScreen")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Iniciar sesión</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={text => this.setState({ email: text })} />
            </Item>
            <Item floatingLabel last>
              <Label>Contraseña</Label>
              <Input />
              <Input secureTextEntry onChangeText={text => this.setState({ password: text })} />
            </Item>
          </Form>
          <Button block style={{ margin: 15, marginTop: 50 }}
            onPress={this.handleSubmit} >
            <Text>Ingresar</Text>
          </Button>
          {this.props.errors.length > 0 && (
            <Item>
              <Text style={styles.validationMessage}>{this.props.errors[0].message}</Text>
            </Item>
          )}
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.googleSignIn}
            disabled={this.state.isSigninInProgress} />
          <FBLogin />
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    login: (email, password) => dispatch(login(email, password)),
    loginGoogleFacebook: (url, nombre, email, password, user_type, apellido, id_token) => dispatch(loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token))
  };
}

const mapStateToProps = (state) => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map((field) => {
      return { field, message: state.auth.errors[field] };
    });
  }
  return {
    errors,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, bindAction)(Login);
