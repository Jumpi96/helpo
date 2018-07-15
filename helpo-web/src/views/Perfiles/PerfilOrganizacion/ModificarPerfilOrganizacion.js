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
      telefono: this.props.data.telefono,
      cuit: this.props.data.cuit,
      descripcion: this.props.data.descripcion,
      avatar_url: this.props.data.avatar.url,
      ubicacion: this.props.data.ubicacion,
      rubro_id: this.props.data.rubro.id,
    }
    this.renderNombre  = this.renderNombre.bind(this);
    this.renderUbicacion = this.renderUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleCuitChange = this.handleCuitChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);
    this.handleDescripcionChange = this.handleDescripcionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);

  }

  renderNombre() {
    return (
      <input
        type="text"
        name="nombre"
        className="form-control"
        placeholder="Nombre"
        value={this.state.nombre}
        onChange={this.handleNombreChange}
      />)    
    }
  
  handleNombreChange(event) {
    this.setState({
      nombre: event.target.value
    })
  }
  

  renderTelefono() {
    return (
      <input
        type="text"
        name="telefono"
        className="form-control"
        placeholder="Telefono"
        value={this.state.telefono}
        onChange={this.handleTelefonoChange}
      />)    
    }

  handleTelefonoChange(event) {
      if (isNaN(event.target.value)) {
        return;
      }
      this.setState({
        telefono: event.target.value
      });
  }

  renderCuit() {
    return (
    <input
      type="text"
      name="cuit"
      className="form-control"
      placeholder="Cuit"
      value={this.state.cuit}
      onChange={this.handleCuitChange}
    />)
  }

  handleCuitChange(event) {
    if (isNaN(event.target.value)) {
      return;
    }
    this.setState({
      cuit: event.target.value
    });
  }

  renderRubro() {
    const listaRubroEventos = this.props.rubros.map((r) =>
      <option key={r.id} data-key={r.id}>{r.nombre}</option>
    );
    const rubro = this.state.rubro_id;
    return(
      <select
        value={rubro}
        className="form-control"
        onChange={this.handleRubroChange}>
          {listaRubroEventos}
      </select>
    )    
  }

  handleRubroChange(event) {
    const selectedIndex = event.target.options.selectedIndex;
    const selectedId = event.target.options[selectedIndex].getAttribute('data-key');
    console.log(selectedId)
    this.setState({
      rubro_id: selectedId
    })
    console.log(this.state)
  }

  renderDescripcion() {
    return (
      <textarea
        rows= '5'
        cols='30'
        className='form-control'
        value={this.state.descripcion}
        onChange={this.handleDescripcionChange}
      />)
  }

  handleDescripcionChange(event) {
    this.setState({
      descripcion: event.target.value
    });
  }

  renderUbicacion() {
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
    return (      
      <Card>
      <form>
        <div class='container'>
        
        <div style={{ alignItems: 'center' }} class='row'>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px'}} class='col'>            
            <p style={{ textAlign: 'right' }} 
               class='h4'>{this.renderNombre()}</p>
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
            <p style={{ paddingTop: '8px',textAlign: 'right' }} class='font-weight-bold col' htmlFor="telefono">Teléfono</p>
            <div class='col'>{this.renderTelefono()}</div>
        </div>

        <div class='row'>   
            <p style={{ paddingTop: '8px',textAlign: 'right' }} class='font-weight-bold col'           htmlFor="cuit">CUIT</p>            
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

       {this.renderUbicacion()}

        </div>      
      </form>
      </Card>
    );
  }
}
ModificarPerfilOrganizacion.propTypes = perfilPropTypes;

export default ModificarPerfilOrganizacion;