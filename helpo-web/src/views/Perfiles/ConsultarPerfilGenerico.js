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
      userId: 0,
      userType: 0,     
      email: '' 
    };
    this.renderConsultar = this.renderConsultar.bind(this)
  }

  componentDidMount() {
      api.get('/auth/user/')
      .then(res => { 
          this.setState({
            userId: res.data.id,
            email: res.data.email,
            userType: res.data.user_type
          })
        }) 
      .catch( error => {
        console.log(error)
      })
  }    

  renderConsultar() {    
    switch (this.state.userType){

      case 1:
        return (<ConsultarPerfilOrganizacion 
                  usuarioId={this.state.userId}
                  email={this.state.email}
                  />)

      case 2:
        return ( <ConsultarPerfilVoluntario 
                  usuarioId={this.state.userId}
                  email={this.state.email}
                  /> )

      case 3:
        return ( <ConsultarPerfilEmpresa 
                  usuarioId={this.state.userId}
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