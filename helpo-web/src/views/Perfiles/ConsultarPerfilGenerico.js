import React, { Component } from 'react';
import ListaRubrosOrganizacion from './ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../api';
import ReactDOM from 'react-dom'


class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {

    };
  }

componentDidMount() {
      api.get('/auth/usuario')
      .then(res => {
        const recursosData = res.data;
        this.setState({ 
          categorias:listaCategorias, 
          categoria_id: selectedCategoria, 
          items: recursosData
        });
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message) };
      })    
  };

  render() {
    if(this.state.usuario.tipo === 1){ {/*VER QUE PREGUNTA HACER*/}
    return (
      
      <ConsultarPerfilOrganizacion organizacion=this.state.usuario />
    );
  }
  if(component.isVoluntario){ {/*VER QUE PREGUNTA HACER*/}
    return (
      <ConsultarPerfilVoluntario voluntario=this.prop />
    );
  }
  if(component.isOrganizacion){ {/*VER QUE PREGUNTA HACER*/}
    return (
      <ConsultarPerfilEmpresa organizacion=this.prop />
    );
  }
  }
}

export default ConsultarPerfilGenerico;