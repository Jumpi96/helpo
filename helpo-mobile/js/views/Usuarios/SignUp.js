import React, { Component } from 'react';
// import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
// import { connect } from "react-redux";
// import {auth} from "../../../actions"; SE USA ABAJO - COMENTADO
// import validateEmail from "../../../utils/ValidateEmail";
import api from '../../api';
import SignUpPresentation from './SignUpPresentation';
import validateEmail from '../../utils/ValidateEmail';


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
    };
    this.handleUserTypeSelect = this.handleUserTypeSelect.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.onSubmitData = this.onSubmitData.bind(this);
    // this.renderErrorList = this.renderErrorList.bind(this);
  }

  onSubmitData() {
    if (this.handleValidation()) {
      const usuario = {
        nombre: this.state.nombre,
        email: this.state.email,
        password: this.state.password,
        user_type: this.state.user_type,
        apellido: this.state.apellido,
      };
      api.post('/auth/sign_up/', usuario)
      .then((res) => { console.log(res); }); // TODO - IR a HOME o Pantalla Logeate pa
    } else {
     // TODO IR a pagina error
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
        this.setState({ email: value });
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
      errors.email = 'Ingrese un email valido';
      isValid = false;
    }
    // Contraseña
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

    return (
      <SignUpPresentation
        data={data}
        onInputChange={this.handleValueChange}
        onTypeChange={this.handleUserTypeSelect}
        onSubmit={this.onSubmitData}
      />
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

export default SignUp;
