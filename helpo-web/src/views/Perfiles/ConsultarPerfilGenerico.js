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
    };
    this.renderConsultar = this.renderConsultar.bind(this)
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
      api.get('/auth/user/')
      .then(res => {           
          this.setState({
            nombre: res.data.nombre,
            userId: res.data.id,
            email: res.data.email,
            userType: res.data.user_type
          })
          return api.get(`/perfiles/${this.getApiCall(this.state.userType)}/${this.state.userId}`)
        })
      .then(res => {
        this.setState({
          data: res.data
        })
        return api.get('/perfiles/rubros_organizacion/')
      })   
      .then( res => {
        this.setState({
          rubros: res.data
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

  render() {
    return (
    <div>
      {this.renderConsultar()}
    </div>
    );
  }
}

export default ConsultarPerfilGenerico;