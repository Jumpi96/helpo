import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader , Button } from 'reactstrap';
import { getImagen } from '../../../utils/Imagen'

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    telefono: PropTypes.number,
    dni: PropTypes.number,
    gustos: PropTypes.string,
    habilidades: PropTypes.string,
    sexo: PropTypes.string,
    apellido: PropTypes.string,
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    })
  }),
  switchToModificar: PropTypes.func.isRequired,
  sinModificar: PropTypes.bool
}

class ConsultarPerfilVoluntario extends Component {
  constructor(props) {
    super(props); 
    this.renderDni = this.renderDni.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);    
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderSexo = this.renderSexo.bind(this);
    this.renderApellido = this.renderApellido.bind(this);
    this.renderGustos = this.renderGustos.bind(this);
    this.renderHabilidades = this.renderHabilidades.bind(this);

  }
  renderSexo() {
    if (this.props.data.sexo == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.sexo}</p>      
  }

  renderApellido() {
    if (this.props.data.apellido == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.apellido}</p>      
  }

  renderGustos() {
    if (this.props.data.gustos == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.gustos}</p>      
  }

  renderHabilidades() {
    if (this.props.data.habilidades == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.habilidades}</p>      
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.telefono}</p>      
  }

  renderDni() {
    if (this.props.data.dni == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.dni}</p>      
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.descripcion}</p>      
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
               class='h4'>{this.props.nombre} {this.renderApellido()}</p>
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
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="dni">DNI</p>
            <div class='col-6'>{this.renderDni()}</div>
        </div>
        
        {/**/}
        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="sexo">Sexo</p>
            <div class='col-6'>{this.renderSexo()}</div>    
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="gustos">Gustos</p>
            <div class='col-6'>{this.renderGustos()}</div>    
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="habilidades">Habilidades</p>
            <div class='col-6'>{this.renderHabilidades()}</div>    
        </div>
        {/**/}            

        <div style={{ width: '500px', justifyContent: 'center' ,display: 'flex', marginBottom: '10px' }} class='row offster-md-4'>          
          {this.props.sinModificar
          ? "" 
          : <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>}
        </div>  
        </div>
      </Card>
    );
  }
}
ConsultarPerfilVoluntario.propTypes = perfilPropTypes;

export default ConsultarPerfilVoluntario;