import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilEmpresa from './PerfilEmpresa/ConsultarPerfilEmpresa'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'
import ModificarPerfilOrganizacion from './PerfilOrganizacion/ModificarPerfilOrganizacion'
import ModificarPerfilEmpresa from './PerfilEmpresa/ModificarPerfilEmpresa'
import ModificarPerfilVoluntario from './PerfilVoluntario/ModificarPerfilVoluntario'

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
      modificar: true,
      loggedUser: true,
    };
    this.renderConsultar = this.renderConsultar.bind(this)
    this.renderModificar = this.renderModificar.bind(this)
    this.renderConsultarOtro = this.renderConsultarOtro.bind(this)
    this.renderComponente = this.renderComponente.bind(this)
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
    // TODO: Otro
    let initialState = {};
      api.get('/auth/user/')
      .then(res => {        

            initialState.nombre = res.data.nombre
            initialState.userId = res.data.id
            initialState.email = res.data.email
            initialState.userType = res.data.user_type          

          return api.get(`/perfiles/${this.getApiCall(initialState.userType)}/${initialState.userId}`)
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
          rubros: initialState.rubros
        })
      })
      .catch( error => {
        console.log(error)
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
                  />)

      case 2:
        return ( <ModificarPerfilVoluntario 
                  email={this.state.email}
                  /> )

      case 3:
        return ( <ModificarPerfilEmpresa 
                  email={this.state.email}
                  /> )

      default:
        return ( <p>Error</p> )        
    }
  }  

  renderConsultarOtro() {    
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  />)

      case 2:
        return ( <ConsultarPerfilVoluntario 
                  email={this.state.email}
                  /> )

      case 3:
        return ( <ConsultarPerfilEmpresa 
                  email={this.state.email}
                  /> )

      default:
        return ( <p>Error</p> )        
    }
  }

  renderConsultar() {    
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion 
                  nombre={this.state.nombre}
                  email={this.state.email}
                  data={this.state.data}
                  />)

      case 2:
        return ( <ConsultarPerfilVoluntario 
                  email={this.state.email}
                  /> )

      case 3:
        return ( <ConsultarPerfilEmpresa 
                  email={this.state.email}
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
      {this.renderComponente()}
    </div>
    );
  }
}

export default ConsultarPerfilGenerico;