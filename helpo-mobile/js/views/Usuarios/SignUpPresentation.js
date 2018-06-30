import { View, StyleSheet } from 'react-native';
import { Text, Content, Container, Form, Label, Item, Input, Button } from 'native-base';
import React from 'react';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 10,
    width: 25,
    //textAlign: 'center',
  },
  button_active: {
    flex: 1,
    margin: 10,
    width: 25,
    backgroundColor: 'green',
    //textAlign: 'center',
  },
  btn_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  error_text: {
    color: 'red',
  },
});


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
          return true;
        }
        return false;
      }
      case '2': {
        if (this.props.data.user_type === '2') {
          return true;
        }
        return false;
      }
      case '3': {
        if (this.props.data.user_type === '3') {
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  }

  renderApellido() {
    const apellido = (
      <View>
        <Item floatingLabel>
          <Label><Text style={styles.text}>Apellido</Text></Label>
          <Input onChangeText={text => this.props.onInputChange(text, 'apellido')} />
        </Item>
        <Text style={styles.error_text}>{this.props.data.errors.apellido}</Text>
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <View style={styles.btn_container}>
            <Button
              rounded style={this.isActiveType('2') ? styles.button_active : styles.button}
              active={this.state.btn_vol}
              onPress={() => this.props.onTypeChange('voluntario')}
            >
              <Text style={styles.text}>Voluntario</Text>
            </Button>
            <Button
              rounded style={this.isActiveType('1') ? styles.button_active : styles.button}
              active={this.state.btn_ong}
              onPress={() => this.props.onTypeChange('ong')}
            >
              <Text style={styles.text}>ONG</Text>
            </Button>
            <Button
              rounded style={this.isActiveType('3') ? styles.button_active : styles.button}
              active={this.state.btn_emp}
              onPress={() => this.props.onTypeChange('empresa')}
            >
              <Text style={styles.text}>Empresa</Text>
            </Button>
          </View>
          <Form>
            <Item floatingLabel>
              <Label><Text style={styles.text}>Nombre</Text></Label>
              <Input onChangeText={text => this.props.onInputChange(text, 'nombre')} />
            </Item>
            <Text style={styles.error_text}>{this.props.data.errors.nombre}</Text>
            {this.renderApellido()}
            <Item floatingLabel>
              <Label><Text>Email</Text></Label>
              <Input onChangeText={text => this.props.onInputChange(text, 'email')} />
            </Item>
            <Text style={styles.error_text}>{this.props.data.errors.email}</Text>
            <Item floatingLabel>
              <Label><Text>Contraseña</Text></Label>
              <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'password')} />
            </Item>
            <Item floatingLabel>
              <Label><Text>Repetir Contraseña</Text></Label>
              <Input secureTextEntry onChangeText={text => this.props.onInputChange(text, 'repeat')} />
            </Item>
            <Text style={styles.error_text}>{this.props.data.errors.contraseña}</Text>
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
