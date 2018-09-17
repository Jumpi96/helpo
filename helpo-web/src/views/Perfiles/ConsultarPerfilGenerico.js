import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilEmpresa from './PerfilEmpresa/ConsultarPerfilEmpresa'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'
import ModificarPerfilOrganizacion from './PerfilOrganizacion/ModificarPerfilOrganizacion'
import ModificarPerfilEmpresa from './PerfilEmpresa/ModificarPerfilEmpresa'
import ModificarPerfilVoluntario from './PerfilVoluntario/ModificarPerfilVoluntario'
import BotonSuscripcion from '../Suscripcion/BotonSuscripcion/BotonSuscripcion'

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
    let initialState = { loggedUser: true};
    let userURL = ""
    const params = this.props.match.params
    // Me fijo si Object params no esta vacio
    if( params.usuarioId ) {
      userURL = `/perfiles/user/${params.usuarioId}/`
      initialState.loggedUser = false
    } 
    else { 
      userURL = '/auth/user/'
    }
      api.get(userURL)
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
      .then( res => {
        
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
          rubros: initialState.rubros,
          loggedUser: initialState.loggedUser
        })
      })
      .catch( error => {
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
                  />)

      case 2:
        return ( <ModificarPerfilVoluntario 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToConsultar={this.switchToConsultar}
                  /> )

      case 3:
        return ( <ModificarPerfilEmpresa 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  rubros={this.state.rubros}
                  switchToConsultar={this.switchToConsultar}
                  /> )

      default:
        return ( <p>Error</p> )        
    }
  }  

  renderConsultarOtro() {    
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion
                  id={this.state.userId}
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  sinModificar={true}
                  />)

      case 2:
        return ( <ConsultarPerfilVoluntario 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  sinModificar={true}
                  /> )

      case 3:
        return ( <ConsultarPerfilEmpresa 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  sinModificar={true}
                  /> )

      default:
        return ( <p>Error</p> )        
    }
  }

  renderConsultar() {
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion 
                  id={this.state.userId}
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  />)

      case 2:
        return ( <ConsultarPerfilVoluntario
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  /> )

      case 3:
        return ( <ConsultarPerfilEmpresa 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  switchToModificar={this.switchToModificar}
                  /> )

      default:
        return ( <p>Error</p> )        
    }
  }  

  renderComponente() {
    if (this.state.loggedUser && this.state.modificar) {
      return this.renderModificar()
    }
    else if (this.state.loggedUser && !this.state.modificar) {
      return this.renderConsultar()
    }
    else { return this.renderConsultarOtro()}
  }

  render() {
    return (
    <div>
      <BotonSuscripcion organizacion={82} />
      {this.renderComponente()}
    </div>
    );
  }
}

export default ConsultarPerfilGenerico;