
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionSheet, Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';

import styles from './styles';
import { login, loginGoogleFacebook } from '../../Redux/actions/auth'
import api from '../../api';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import { Dimensions } from 'react-native';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isGoogleSigninInProgress: false,
      isLoginFound: false,
      emailEnviado: undefined,
      passwordReseteada: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSubmitFacebook = this.onSubmitFacebook.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
    this.sendResetPasswordEmail = this.sendResetPasswordEmail.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '93328850687-681u9fksr6g52g2bebbj1qu8thldgaq6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: 'gmail.com', // specifies a hosted domain restriction
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  componentDidUpdate() {
    const auth = this.props.auth;
    if (auth.isAuthenticated) {
      this.props.navigation.navigate('LaunchScreen');
    }
  }

  showToast(socialNet) {
    // No usado, lo dejo de recuerdo o como ejemplo de Toast
    ActionSheet.show(
      {
        options: [
          { text: "Cancelar", icon: "close", iconColor: "#fa213b" },
          { text: "Aceptar", icon: "american-football", iconColor: "#2c8ef4" }
        ],
        title: "¿Desea iniciar sesión con " + socialNet + "?"
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          this.props.navigation.navigate('LaunchScreen');
        }
      });
  }

  preLoginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token) {
    const auth = this.props.auth;
    this.props.loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      this.setState({ isLoginFound: true });
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

  onSubmitFacebook(data) {
    const nombre = data.profile.name;
    const email = data.profile.email;
    const password = data.profile.email;
    const user_type = 2;
    const apellido = data.profile.name;
    const id_token = data.credentials.token;
    const url = "/auth/exists_facebook/";
    this.existsGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
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
      this.setState({ isGoogleSigninInProgress: false });
      console.log(userInfo);
      this.onSubmitGoogle(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({ isGoogleSigninInProgress: false });
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({ isGoogleSigninInProgress: true });
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({ isGoogleSigninInProgress: false });
        console.log(error);
      } else {
        this.setState({ isGoogleSigninInProgress: false });
        console.log(error);
      }
    }
  };

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

  handleSubmit(e) {
    e.preventDefault();
    const auth = this.props.auth;
    this.setState({ passwordReseteada: undefined });
    if (auth.isVerificationError) {
      this.setState({ emailEnviado: undefined });
    }
    const email = this.state.email.toLowerCase();
    this.props.login(email, this.state.password);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      this.setState({ isLoginFound: true });
      this.props.navigation.navigate("LaunchScreen");
    }
  }

  render() {
    var _this = this;
    var { width } = Dimensions.get('window');
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
          {(this.props.auth.isVerificationError && this.state.emailEnviado === undefined) ?
            <Item>
              <Text onPress={this.sendVerificationEmail} style={styles.suggestionMessage}>Para enviar el correo de verificación, haga click aquí</Text>
            </Item>
            : undefined}
          {this.state.emailEnviado ?
            <Item>
              <Text style={styles.suggestionMessage}>Correo de verificación enviado.</Text>
            </Item>
            : (this.state.emailEnviado === false) ?
              <Item>
                <Text style={styles.suggestionMessage}>El email ingresado no existe.</Text>
              </Item>
              : undefined}
          {this.state.passwordReseteada ?
            <Item>
              <Text style={styles.suggestionMessage}>Se ha enviado un email a {this.state.email}</Text>
            </Item>
            : (this.props.errors.length > 0 && !this.props.auth.isVerificationError) ?
              (this.state.passwordReseteada === false) ?
                <Item>
                  <Text style={styles.suggestionMessage}>El email ingresado no existe.</Text>
                </Item>
                :
                <Item>
                  <Text onPress={this.sendResetPasswordEmail} style={styles.suggestionMessage}>¿Olvidaste tu contraseña?</Text>
                </Item>
              : undefined}
          <FBLogin
            permissions={["email"]}
            style={{ margin: 15, marginTop: 50 }}
            loginBehavior={FBLoginManager.LoginBehaviors.WebView}
            onLogin={function (data) {
              console.log("Logged in!");
              console.log(data);
              _this.onSubmitFacebook(data);
            }}
            onLogout={function () {
              console.log("Logged out.");
              const auth = _this.props.auth;
              if (auth.isAuthenticated) {
                _this.props.navigation.navigate("LaunchScreen");
              }
            }}
            onLoginFound={function (data) {
              console.log("Existing login found.");
              console.log(data);
            }}
            onLoginNotFound={function () {
              console.log("No user logged in.");
            }}
            onError={function (data) {
              console.log("ERROR");
              console.log(data);
            }}
            onCancel={function () {
              console.log("User cancelled.");
            }}
            onPermissionsMissing={function (data) {
              console.log("Check permissions!");
              console.log(data);
            }}
          />
          <GoogleSigninButton
            style={{ width: width - 30, height: 48, marginLeft: 15 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.googleSignIn}
            disabled={this.state.isGoogleSigninInProgress} />
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
