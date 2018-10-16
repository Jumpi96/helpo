import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'
import {
  Container,
} from 'native-base';

class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    const { params } = this.props.navigation.state;
    const user = params ? params.user : undefined;
    this.state = {
      nombre: '',
      userId: user,
      userType: 0,
      email: '',
      data: {},
      rubros: [], // [{ id: , nombre: },]
      modificar: false,
      loggedUser: true,
    };
    this.renderConsultar = this.renderConsultar.bind(this)
    this.renderConsultarOtro = this.renderConsultarOtro.bind(this)
    this.renderComponente = this.renderComponente.bind(this)
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
    const link = this.state.userId ? `/perfiles/user/${this.state.userId}/` : '/auth/user/';
    api.get(link)
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
          switchToEventosOrg={() => this.props.navigation.navigate('ConsultarEventos', { organizacion: this.state.data.usuario.id })}
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
          switchToModificar={() => this.props.navigation.navigate('ModificarPerfilVoluntario')}
          goBack={this.goBack}
        />)

      default:
        return (<ConsultarPerfilOrganizacion
          id={this.state.userId}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={() => this.props.navigation.navigate('ModificarPerfilOrganizacion')}
          switchToEventosOrg={() => this.props.navigation.navigate('ConsultarEventos', { organizacion: this.state.data.usuario.id })}
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