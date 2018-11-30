import { View, Dimensions } from 'react-native';
import {
  Text, Content, Container, Form, Label, Item, Input, Button,
  Left, Right, Header, Body, Title, Icon, Picker, ListItem
} from 'native-base';
import styles from './styles';
import React from 'react';
import PropTypes from 'prop-types';
import { GoogleSigninButton } from 'react-native-google-signin';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

// Styles
// Native base doesnt let you create Stylesheet
const styBtn = {
  flex: 1,
  margin: 10,
  width: 25,
  alignItems: 'center',
  justifyContent: 'center',
};
const styBtnActive = {
  flex: 1,
  margin: 10,
  width: 25,
  backgroundColor: 'green',
  alignItems: 'center',
  justifyContent: 'center',
};
const styBtnContainer = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
};
const styTitle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
};
const styText = {
  textAlign: 'center',
  fontSize: 13,
};
const styErrorText = {
  color: 'red',
};
//

const signUpPropTypes = {
  data: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    user_type: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    repeat: PropTypes.string,
    errors: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
      email: PropTypes.string,
      contraseña: PropTypes.string,
    }),
    registroConDatos: false
  }),
  onInputChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

class SignUpPresentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btn_vol: true,
      btn_ong: false,
      btn_emp: false,
    };
    this.renderApellido = this.renderApellido.bind(this);
    this.isActiveType = this.isActiveType.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  isActiveType(type) {
    switch (type) {
      case '1': {
        if (this.props.data.user_type === '1') {
          return styBtnActive;
        }
        return styBtn;
      }
      case '2': {
        if (this.props.data.user_type === '2') {
          return styBtnActive;
        }
        return styBtn;
      }
      case '3': {
        if (this.props.data.user_type === '3') {
          return styBtnActive;
        }
        return styBtn;
      }
      default:
        return styBtn;
    }
  }

  renderApellido() {
    const apellido = (
      <View>
        <Item floatingLabel>
          <Label>Apellido</Label>
          <Input onChangeText={text => this.props.onInputChange(text, 'apellido')} />
        </Item>
        <Text style={styErrorText}>{this.props.data.errors.apellido}</Text>
      </View>
    );
    if (this.props.data.user_type === '2') {
      return apellido;
    }
    return <View />;
  }

  handleChange(value, index) {
    switch (value) {
      case 1: {
        this.props.onTypeChange('ong');
        break;
      }
      case 2: {
        this.props.onTypeChange('voluntario');
        break;
      }
      case 3: {
        this.props.onTypeChange('empresa');
        break;
      }
    }
  }

  getSelectedType() {
    return parseInt(this.props.data.user_type);
  }

  render() {
    var _this = this;
    var { width } = Dimensions.get('window');
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent
              onPress={() => this.props.handleBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Registrarse</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ListItem>
            <Left>
              <Text>Tipo de usuario</Text>
            </Left>
            <Body>
              <Picker
                note
                mode='dropdown'
                selectedValue={this.getSelectedType()}
                onValueChange={this.handleChange}
              >
                <Item value={2} key={2} label='Voluntario' />
                <Item value={1} key={1} label='ONG' />
                <Item value={3} key={3} label='Empresa' />
              </Picker>
            </Body>
          </ListItem>
          {!this.state.registroConDatos ?
            <View>
              <Button block style={{ margin: 15, marginTop: 50, flex: 1 }}
                onPress={() => this.setState({ registroConDatos: true })}
              >
                <Text>Crear cuenta con sus datos</Text>
              </Button>              
              <FBLogin
                permissions={["email"]}
                style={{ margin: 15, marginTop: 50 }}
                loginBehavior={FBLoginManager.LoginBehaviors.WebView}
                onLogin={function (data) {
                  console.log("Logged in!");
                  console.log(data);
                  _this.props.onSubmitFacebook(data);
                }}
                onLogout={function () {
                  console.log("Logged out.");
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
                onPress={this.props.googleSignIn}
                disabled={this.props.isGoogleSigninInProgress} />
            </View> : undefined}
          {this.state.registroConDatos ?
            <Form>
              <Item floatingLabel>
                <Label>Nombre</Label>
                <Input onChangeText={text => this.props.onInputChange(text, 'nombre')} />
              </Item>
              <Text style={styErrorText}>{this.props.data.errors.nombre}</Text>
              {this.renderApellido()}
              <Item floatingLabel>
                <Label>Email</Label>
                <Input onChangeText={text => this.props.onInputChange(text, 'email')} />
              </Item>
              <Text style={styErrorText}>{this.props.data.errors.email}</Text>
              <Item floatingLabel>
                <Label>Contraseña</Label>
                <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'password')} />
              </Item>
              <Item floatingLabel>
                <Label>Repetir contraseña</Label>
                <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'repeat')} />
              </Item>
              <Text style={styErrorText}>{this.props.data.errors.contraseña}</Text>
              <Button block style={{ margin: 15, flex: 1 }}
                onPress={() => this.props.onSubmit()}
              >
                <Text>Registrar</Text></Button>
            </Form>
            : undefined}
        </Content>
      </Container>
    );
  }
}
SignUpPresentation.propTypes = signUpPropTypes;

export default SignUpPresentation;
