import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'
//import ModificarPerfilOrganizacion from './PerfilOrganizacion/ModificarPerfilOrganizacion'
//import ModificarPerfilEmpresa from './PerfilEmpresa/ModificarPerfilEmpresa'
import ModificarPerfilVoluntario from './PerfilVoluntario/ModificarPerfilVoluntario'
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Label,
  ListItem,
  Body,
  Left,
  Right,
  Icon,
  Thumbnail,
  Text,
  Separator,
} from 'native-base';

class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
      nombre: '',
      userId: 0, // 1: ONG, 2: Vol, 3: Empresa
      userType: 0,
      email: '',
      data: {},
      rubros: [], // [{ id: , nombre: },]
      modificar: false,
      loggedUser: true,
    };
    this.renderConsultar = this.renderConsultar.bind(this)
    this.renderModificar = this.renderModificar.bind(this)
    this.renderConsultarOtro = this.renderConsultarOtro.bind(this)
    this.renderComponente = this.renderComponente.bind(this)
    this.switchToConsultar = this.switchToConsultar.bind(this)
    this.switchToModificar = this.switchToModificar.bind(this)
    this.goBack = this.goBack.bind(this);
  }

  getApiCall(userType) {
    switch (userType) {
      case 1:
        return 'perfil_organizacion'
      case 2:
        return 'perfil_voluntario'
      case 3:
        return 'perfil_empresa'
      default:
        return ''
    }
  }

  componentDidMount() {
    let initialState = {};
    api.get('/auth/user/')
      .then(res => {
        initialState.nombre = res.data.nombre
        initialState.userId = res.data.id
        initialState.email = res.data.email
        initialState.userType = res.data.user_type
        return api.get(`/perfiles/${this.getApiCall(initialState.userType)}/${initialState.userId}/`)
      })
      .then(res => {
        initialState.data = res.data
        return api.get('/perfiles/rubros_organizacion/')
      })
      .then(res => {
        initialState.rubros = res.data
      })
      .then(() => {
        // Cambio estado aca para asegurarme que se llame todo lo anterior
        this.setState({
          nombre: initialState.nombre,
          userId: initialState.userId,
          email: initialState.email,
          userType: initialState.userType,
          data: initialState.data,
          rubros: initialState.rubros
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  switchToConsultar() {
    this.componentDidMount()
    this.setState({
      modificar: false
    })
  }

  switchToModificar() {
    this.setState({
      modificar: true
    })
  }

  renderModificar() {
    switch (this.state.userType) {
      case 1:
        return (<ModificarPerfilOrganizacion
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubros}
          switchToConsultar={this.switchToConsultar}
          goBack={this.goBack}
        />)

      case 2:
        return (<ModificarPerfilVoluntario
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToConsultar={this.switchToConsultar}
          goBack={this.goBack}
        />)

      case 3:
        return (<ModificarPerfilEmpresa
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubros}
          switchToConsultar={this.switchToConsultar}
          goBack={this.goBack}
        />)

      default:
        return (<Text>Error</Text>)
    }
  }

  goBack() {
    this.props.navigation.navigate("LaunchScreen");
  }

  renderConsultarOtro() {
    switch (this.state.userType) {
      case 2:
        return (<ConsultarPerfilVoluntario
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          goBack={this.goBack}
        />)

      default:
        return (<ConsultarPerfilOrganizacion
          id={this.state.userId}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          goBack={this.goBack}
        />)
    }
  }

  renderConsultar() {
    switch (this.state.userType) {
      case 2:
        return (<ConsultarPerfilVoluntario
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          goBack={this.goBack}
        />)

      default:
        return (<ConsultarPerfilOrganizacion
          id={this.state.userId}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          goBack={this.goBack}
        />)
    }
  }

  renderComponente() {
    if (this.state.loggedUser && this.state.modificar) {
      return this.renderModificar()
    }
    else if (this.state.loggedUser && !this.state.modificar) {
      return this.renderConsultar()
    }
    else { return this.renderConsultarOtro() }
  }


  render() {
    return (
      <Container>
        {this.renderComponente()}
      </Container>
    );
  }
}

export default ConsultarPerfilGenerico;