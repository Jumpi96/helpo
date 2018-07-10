import React, { Component, View } from 'react';
import ListaRubrosOrganizacion from '../ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import ModificarPerfilOrganizacion from './ModificarPerfilOrganizacion';
import SelectorUbicacion from '../../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../../api';
import CargadorImagenPerfil from '../CargadorImagenPerfil/CargadorImagenPerfil';
import { Card } from 'reactstrap';


class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
      nombre: 'organizacion',
      cuit: '',
      ubicacion: { latitud: 0, longitud: 0, notas:'#!None#!'},
      mail: '',
      telefono: '',
      rubro: { id: 0, nombre: "none"},
      avatar_url: 'assets/user.png',
      descripcion: '',
      errors: {},
    };
  }

  
  componentDidMount() {
    api.get(`/perfiles/perfil_organizacion/${this.props.usuarioId}`)
    .then( (res) => {
      let rubro = res.rubro
      let ubicacion = res.ubicacion
      if ( rubro == null ) {
        rubro = { id: 0, nombre: 'none'}
      }
      if ( ubicacion == null ) {
        ubicacion = { latitud: 0, longitud: 0, notas:'#!None#!'}
      }
      this.setState({
        cuit: res.cuit,
        telefono: res.telefono,
        descripcion: res.descripcion,
        rubro_id: rubro.id,
        rubro_nombre: rubro.nombre,
        avatar_url: res.avatar.url,        
      })
    })
  }  

  mostrarUbicacion(){
    if(this.state.ubicacion.latitud === 0 && this.state.ubicacion.longitud === 0){
    }
    else{
      return      
        <SelectorUbicacion
        name="selectorUbicacion"
        ubicacion={this.state.ubicacion}
      />             
    }
  }

  modificarPerfil(){
    return <ModificarPerfilOrganizacion {...this.props.usuarioId}/>
  }

  render() {
    return (
      <Card>
      <form onSubmit={this.handleSubmit}>
        <div className="row">
        
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Nombre</label>
            <text>{this.state.nombre}</text>
          </div>

          <text>{JSON.stringify(this.state)}</text>
          <div className="form-group col-md-6">
          <View>
            <img
              src={this.avatar_url}
              width="100" 
              height="100"
            />
          </View>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="mail">Mail</label>
            <text>{this.state.mail}</text>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Teléfono</label>
            <text>{this.state.telefono}</text>          
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="cuit">CUIT</label>
            <text>{this.state.cuit}</text>
          </div>

          
         <div className="form-group col-md-6">
            <label htmlFor="telefono">Rubro</label>
            <text>{this.state.rubro.nombre}</text>          
          </div>

          <div className="form-group col-md-6">
            {this.mostrarUbicacion()}       
          </div>              

          <div className="form-group">
          <label htmlFor="descripcion">Descripcion</label> 
          <text>{this.state.descripcion}</text>          
          </div>      

        </div>

        <div className="btn btn-primary">
          <button onclick={modificarPerfil()}>
          Modificar Perfil 
          </button>                
        </div>

      </form>
      </Card>

    );
  }
}
export default ConsultarPerfilOrganizacion;