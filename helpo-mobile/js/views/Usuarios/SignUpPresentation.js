import { View, StyleSheet } from 'react-native';
import { Text, Content, Container, Form, Label, Item, Input, Button } from 'native-base';
import React from 'react';
import PropTypes from 'prop-types';

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
  }),
  onInputChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

class SignUpPresentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btn_vol: false,
      btn_ong: false,
      btn_emp: false,
    };
    this.renderApellido = this.renderApellido.bind(this);
    this.isActiveType = this.isActiveType.bind(this);
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
          <Label><Text style={styText}>Apellido</Text></Label>
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


  render() {
    return (
      <Container>
        <Content>
          <Text style={styTitle}>Crear Cuenta</Text>
          <View style={styBtnContainer}>
            <Button
              rounded style={this.isActiveType('2')}
              active={this.state.btn_vol}
              onPress={() => this.props.onTypeChange('voluntario')}
            >
              <Text style={styText}>Voluntario</Text>
            </Button>
            <Button
              rounded style={this.isActiveType('1')}
              active={this.state.btn_ong}
              onPress={() => this.props.onTypeChange('ong')}
            >
              <Text style={styText}>ONG</Text>
            </Button>
            <Button
              rounded style={this.isActiveType('3')}
              active={this.state.btn_emp}
              onPress={() => this.props.onTypeChange('empresa')}
            >
              <Text style={styText}>Empresa</Text>
            </Button>
          </View>
          <Form>
            <Item floatingLabel>
              <Label><Text style={styText}>Nombre</Text></Label>
              <Input onChangeText={text => this.props.onInputChange(text, 'nombre')} />
            </Item>
            <Text style={styErrorText}>{this.props.data.errors.nombre}</Text>
            {this.renderApellido()}
            <Item floatingLabel>
              <Label><Text style={styText}>Email</Text></Label>
              <Input onChangeText={text => this.props.onInputChange(text, 'email')} />
            </Item>
            <Text style={styErrorText}>{this.props.data.errors.email}</Text>
            <Item floatingLabel>
              <Label><Text style={styText}>Contraseña</Text></Label>
              <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'password')} />
            </Item>
            <Item floatingLabel>
              <Label><Text style={styText}>Repetir Contraseña</Text></Label>
              <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'repeat')} />
            </Item>
            <Text style={styErrorText}>{this.props.data.errors.contraseña}</Text>
          </Form>
          <Button
            rounded style={{ margin: 20, flex: 1 }}
            onPress={() => this.props.onSubmit()}
          >
            <Text>Registrar</Text></Button>
        </Content>
      </Container>
    );
  }
}
SignUpPresentation.propTypes = signUpPropTypes;

export default SignUpPresentation;
