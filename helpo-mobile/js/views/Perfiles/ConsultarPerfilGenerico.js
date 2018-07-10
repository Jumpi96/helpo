import React, { Component } from 'react';
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilEmpresa from './PerfilEmpresa/ConsultarPerfilEmpresa'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'

class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
      userId: 0,
      userType: 0,     
      email: '' 
    };
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
        return <ConsultarPerfilOrganizacion {...this.props.usuarioId}/>

      case 2:
        return <ConsultarPerfilVoluntario {...this.props.usuarioId}/>

      case 3:
        return <ConsultarPerfilEmpresa {...this.props.usuarioId}/>

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