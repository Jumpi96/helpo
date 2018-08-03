import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader, Button } from 'reactstrap';
import {Gmaps, Marker} from 'react-gmaps';
import { getImagen } from '../../../utils/Imagen'
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
  }),
  switchToModificar: PropTypes.func.isRequired,
}

class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); 
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}} class='col-2'>
        <p style={{ textAlign: 'right'}} class='font-weight-bold' htmlFor="descripcion">Ubicación</p>
        </div>

        <div class='col-6'>
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
        
        <p style={{ marginTop: '10px' }}>{this.props.data.ubicacion.notas}</p>
        </div>
      </div>
       )         
    }
  }  
  

  render() {    
    return (      
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Perfil
        </CardHeader>
        <div class='container'>
        
        <div style={{ alignItems: 'center' }} class='row'>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px'}} class='col-2'>            
            <p style={{ textAlign: 'right' }} 
               class='h4'>{this.props.nombre}</p>
          </div>
          <div class='col-6'>
            <img
              class='rounded-circle'
              src={getImagen(this.props.data.avatar.url)}
              alt="avatar"
              width="100" 
              height="100"
            />
          </div>
        </div>
          
        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="mail">Mail</p>
            <div class='col-6'><p>{this.props.email}</p></div>
        </div>

        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="telefono">Teléfono</p>
            <div class='col-6'>{this.renderTelefono()}</div>
        </div>

        <div class='row'>          
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="cuit">CUIT</p>
            <div class='col-6'>{this.renderCuit()}</div>
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="telefono">Rubro</p>
            <div class='col-6'>{this.renderRubro()}</div>    
        </div>                       

        <div class='row'>          
          <p style={{ paddingLeft: 0 ,textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="descripcion">Descripción</p> 
          <div class='col-6'>{this.renderDescripcion()}</div>    
        </div>             

        {this.mostrarUbicacion()}

        <div style={{ width: '500px', justifyContent: 'center' ,display: 'flex', marginBottom: '10px' }} class='row offster-md-4'>          
          <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>
        </div>  
        </div>      
      </Card>
    );
  }
}
ConsultarPerfilOrganizacion.propTypes = perfilPropTypes;

export default ConsultarPerfilOrganizacion;