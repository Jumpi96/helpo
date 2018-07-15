import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card } from 'reactstrap';
import user_avatar from '../../../assets/user.svg'
import {Gmaps, Marker} from 'react-gmaps';
//https://github.com/MicheleBertoli/react-gmaps

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    telefono: PropTypes.number,
    cuit: PropTypes.number,
    descripcion: PropTypes.string,
    rubro: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
    }),
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    ubicacion: PropTypes.shape({
      latitud: PropTypes.number,
      longitud: PropTypes.number,
      notas: PropTypes.string,
    }),
    usuario: PropTypes.number,//User Id
    rubros: PropTypes.array.isRequired,
  })
}

class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      nombre: this.props.nombre,
      telefono: this.props.telefono,
      cuit: this.props.cuit,
      
    }
    this.mostrarUbicacion = this.mostrarUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.telefono}</p>      
  }

  renderCuit() {
    if (this.props.data.cuit == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.cuit}</p>      
  }

  renderRubro() {
    if (this.props.data.rubro == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.rubro.nombre}</p>      
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.descripcion}</p>      
  }

  mostrarUbicacion() {
    if(this.props.data.ubicacion == null || (this.props.data.ubicacion.latitud === 0 && this.props.data.ubicacion.longitud === 0)){
    }
    else{
      const params = {v: '3.exp', key: process.env.GOOGLE_API_KEY}
      return (      
        <div class='row' style={{ marginBottom: '20px'}} >   
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}} class='col'>
        <p style={{ textAlign: 'right'}} class='font-weight-bold' htmlFor="descripcion">Ubicacion</p>
        </div>

        <div class='col'>
        <Gmaps
          width={'300px'}
          height={'300px'}
          lat={this.props.data.ubicacion.latitud}
          lng={this.props.data.ubicacion.longitud}
          zoom={12}
          params={params}>
          <Marker
            lat={this.props.data.ubicacion.latitud}
            lng={this.props.data.ubicacion.longitud}
          />
        </Gmaps>
        
        <p style={{ marginTop: '10px' }}>Predio san carlos</p>
        </div>
      </div>
       )         
    }
  }  
  

  render() {    
    console.log(JSON.stringify(this.props))
    return (      
      <Card>
        <div class='container'>
        
        <div style={{ alignItems: 'center' }} class='row'>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px'}} class='col'>            
            <p style={{ textAlign: 'right' }} 
               class='h4'>{this.props.nombre}</p>
          </div>
          <div class='col'>
            <img
              class='rounded-circle'
              src={user_avatar}
              alt="avatar"
              width="100" 
              height="100"
            />
          </div>
        </div>
          
        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col' htmlFor="mail">Mail</p>
            <div class='col'><p>{this.props.email}</p></div>
        </div>

        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col' htmlFor="telefono">Teléfono</p>
            <div class='col'>{this.renderTelefono()}</div>
        </div>

        <div class='row'>          
            <p style={{ textAlign: 'right' }} class='font-weight-bold col' htmlFor="cuit">CUIT</p>
            <div class='col'>{this.renderCuit()}</div>
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col' htmlFor="telefono">Rubro</p>
            <div class='col'>{this.renderRubro()}</div>    
        </div>                       

        <div class='row'>          
          <p style={{ textAlign: 'right' }} class='font-weight-bold col' htmlFor="descripcion">Descripcion</p> 
          <div class='col'>{this.renderDescripcion()}</div>    
        </div>      

       {this.mostrarUbicacion()}

        </div>      
      </Card>
    );
  }
}
ModificarPerfilOrganizacion.propTypes = perfilPropTypes;

export default ModificarPerfilOrganizacion;