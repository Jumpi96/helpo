import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilEmpresa from './PerfilEmpresa/ConsultarPerfilEmpresa'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'

class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
      nombre: '',
      userId: 0, // 1: ONG, 2: Vol, 3: Empresa
      userType: 0,     
      email: '',
      data: {},
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
      })   
      .catch( error => {
        console.log(error)
      })
  }    

  renderConsultar() {    
    switch (this.state.userType){
      //sdasd
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