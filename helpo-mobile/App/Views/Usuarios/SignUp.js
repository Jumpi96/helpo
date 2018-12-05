import React, { Component } from 'react';
// import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
// import {auth} from "../../../actions"; SE USA ABAJO - COMENTADO
// import validateEmail from "../../../utils/ValidateEmail";
import api from '../../api';
import SignUpPresentation from './SignUpPresentation';
import validateEmail from '../../Lib/ValidateEmail';
import { Alert } from 'react-native';
import { Container } from 'native-base';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { loginGoogleFacebook } from '../../Redux/actions/auth'


class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      apellido: '',
      user_type: '2',
      email: '',
      password: '',
      repeat: '',
      errors: {
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
      },
      isGoogleSigninInProgress: false,
      isLoginFound: false,
    };
    this.handleUserTypeSelect = this.handleUserTypeSelect.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.onSubmitData = this.onSubmitData.bind(this);
    this.onSubmitFacebook = this.onSubmitFacebook.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
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
      Alert.alert(
        '¡Registro exitoso en Helpo!',
        'Revise su correo para activar su cuenta',
        [{ text: 'Volver', onPress: () => this.props.navigation.navigate('LaunchScreen') }]
      );
    }
  }

  onSubmitFacebook(data) {
    const nombre = data.profile.name;
    const email = data.profile.email;
    const password = data.profile.email;
    const user_type = 2;
    const apellido = data.profile.name;
    const id_token = data.credentials.token;
    const url = "/auth/facebook/";
    const auth = this.props.auth;
    this.props.loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      Alert.alert(
        '¡Registro exitoso en Helpo!',
        'Revise su correo para activar su cuenta',
        [{ text: 'Volver', onPress: () => this.props.navigation.navigate('LaunchScreen') }]
      );
      this.setState({ isLoginFound: true });
    }
  }

  onSubmitGoogle(userInfo) {
    const nombre = userInfo.user.givenName;
    const email = userInfo.user.email;
    const password = userInfo.user.email;
    const user_type = 2;
    const apellido = userInfo.user.familyName;
    const id_token = userInfo.idToken;
    const url = "/auth/google/";
    const auth = this.props.auth;
    this.props.loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token);
    if (auth.isAuthenticated) {
      // Issue #105: Necesita dos clicks para loguear
      Alert.alert(
        '¡Registro exitoso en Helpo!',
        'Revise su correo para activar su cuenta',
        [{ text: 'Volver', onPress: () => this.props.navigation.navigate('LaunchScreen') }]
      );
      this.setState({ isLoginFound: true });
    }
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

  onSubmitData() {
    if (this.handleValidation()) {
      const usuario = {
        nombre: this.state.nombre,
        email: this.state.email,
        password: this.state.password,
        user_type: this.state.user_type,
        apellido: this.state.apellido,
      };
      api.post("/auth/sign_up/", usuario)
        .then(res => {
          if (res.status === 200) {
            Alert.alert(
              '¡Registro exitoso en Helpo!',
              'Revise su correo para activar su cuenta',
              [{ text: 'Volver', onPress: () => this.props.navigation.navigate('LaunchScreen') }]
            );
          }
        }
        )
        .catch(res => {
          if (res.status !== 200) {
            Alert.alert(
              'Error al registrarse en Helpo',
              'Ya existe un usuario con ese mail',
              [{ text: 'Volver' }]
            );
          }
        }
        )
    }
  }

  handleUserTypeSelect(user_type) {
    switch (user_type) {
      case 'voluntario': {
        this.setState({ user_type: '2', apellido: '' });
        break;
      }
      case 'ong': {
        this.setState({ user_type: '1', apellido: 'ong' });
        break;
      }
      case 'empresa': {
        this.setState({ user_type: '3', apellido: 'empresa' });
        break;
      }
      default: {
        break;
      }
    }
  }

  handleValueChange(value, type) {
    switch (type) {
      case 'nombre': {
        this.setState({ nombre: value });
        break;
      }
      case 'apellido': {
        this.setState({ apellido: value });
        break;
      }
      case 'email': {
        this.setState({ email: value.toLowerCase() });
        break;
      }
      case 'password': {
        this.setState({ password: value });
        break;
      }
      case 'repeat': {
        this.setState({ repeat: value });
        break;
      }
      default: {
        break;
      }
    }
  }

  handleValidation() {
    const errors = {
      nombre: '',
      apellido: '',
      email: '',
      contraseña: '',
    };
    let isValid = true;

    // Nombre
    if (this.state.nombre === '') {
      errors.nombre = 'Debe ingresar un nombre';
      isValid = false;
    }
    // Apellido
    if (this.state.user_type === 'voluntario' && this.state.apellido === '') {
      errors.apellido = 'Debe ingresar un apellido';
      isValid = false;
    }
    // Mail
    if (this.state.email === '') {
      errors.email = 'Debe ingresar un email';
      isValid = false;
    }
    if (errors.email === '' && !validateEmail(this.state.email)) {
      errors.email = 'Ingrese un email válido';
      isValid = false;
    }
    // Contraseña
    if (this.state.password.length < 8) {
      errors.contraseña = "La contraseña debe tener al menos 8 dígitos"
      isValid = false;
    }
    if (this.state.password === '' || this.state.repeat === '') {
      errors.contraseña = 'Debe ingresar la contraseña en ambos campos';
      isValid = false;
    }
    if (errors.contraseña === '' && this.state.password !== this.state.repeat) {
      errors.contraseña = 'La contraseña no coincide en ambos campos';
      isValid = false;
    }
    // End
    if (isValid) {
      return isValid;
    }
    this.setState({ errors });
    return isValid;
  }

  renderErrorList() {
    const list = [];
    let ids = 0;
    for (const key in this.state.errors) {
      const value = this.state.errors[key];
      if (value !== '') { list.push((<li key={ids}><span style={{ color: 'red' }}>{value}</span></li>)); }
      ids += 1;
    }
    return list;
  }


  render() {
    const data = this.state;
    var _this = this;

    return (
      <Container>
        <SignUpPresentation
          data={data}
          handleBack={() => this.props.navigation.navigate("LaunchScreen")}
          onInputChange={this.handleValueChange}
          onTypeChange={this.handleUserTypeSelect}
          onSubmit={this.onSubmitData}
          onSubmitFacebook={this.onSubmitFacebook}
          googleSignIn={this.googleSignIn}
          isGoogleSigninInProgress={this.state.isGoogleSigninInProgress}
        />
      </Container>
    );
  }
}

/*
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
*/
// NO SACAR POR LAS DUDAS
/* const mapDispatchToProps = dispatch => {
  return {
    register: (username, password) => dispatch(auth.register(username, password)),
  };
}*/

function bindAction(dispatch) {
  return {
    loginGoogleFacebook: (url, nombre, email, password, user_type, apellido, id_token) => dispatch(loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token))
  };
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, bindAction)(SignUp);
