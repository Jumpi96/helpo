import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Gmaps, Marker } from 'react-gmaps';
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
    }).isRequired,
    ubicacion: PropTypes.shape({
      latitud: PropTypes.number,
      longitud: PropTypes.number,
      notas: PropTypes.string,
    }),
  }),
  switchToModificar: PropTypes.func.isRequired,
  sinModificar: PropTypes.bool
}

class ConsultarPerfilEmpresa extends Component {
  constructor(props) {
    super(props);
    this.mostrarUbicacion = this.mostrarUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.getLinkVerEventos = this.getLinkVerEventos.bind(this);
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.telefono}</p>
  }

  renderCuit() {
    if (this.props.data.cuit == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.cuit}</p>
  }

  renderRubro() {
    if (this.props.data.rubro == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.rubro.nombre}</p>
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.descripcion}</p>
  }

  mostrarUbicacion() {
    if (this.props.data.ubicacion == null || (this.props.data.ubicacion.latitud === 0 && this.props.data.ubicacion.longitud === 0)) {
    }
    else {
      const params = { v: '3.exp', key: process.env.GOOGLE_API_KEY }
      return (
        <div className='row' style={{ marginBottom: '20px' }} >
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='col-2'>
            <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="descripcion">Ubicación</p>
          </div>

          <div className='col-6'>
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

  getLinkVerEventos() {
    if (this.props.data.usuario) {
      return '/actividades/consultar-eventos?empresa=' + this.props.data.usuario.id;
    }
  }

  render() {
    const link = this.getLinkVerEventos();
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Perfil
        </CardHeader>
        <div className='container'>

          <div style={{ alignItems: 'center' }} className='row'>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px' }} className='col-2'>
              <p style={{ textAlign: 'right' }}
                className='h4'>{this.props.nombre}</p>
            </div>
            <div className='col-6'>
              <img
                className='rounded-circle'
                src={getImagen(this.props.data.avatar.url)}
                alt="avatar"
                width="100"
                height="100"
              />
            </div>
          </div>

          <div className='row'>
            <p style={{ textAlign: 'right' }} className='font-weight-bold col-2' htmlFor="mail">Mail</p>
            <div className='col-6'><p>{this.props.email}</p></div>
          </div>

          <div className='row'>
            <p style={{ textAlign: 'right' }} className='font-weight-bold col-2' htmlFor="telefono">Teléfono</p>
            <div className='col-6'>{this.renderTelefono()}</div>
          </div>

          <div className='row'>
            <p style={{ textAlign: 'right' }} className='font-weight-bold col-2' htmlFor="cuit">CUIT</p>
            <div className='col-6'>{this.renderCuit()}</div>
          </div>

          <div className='row'>
            <p style={{ textAlign: 'right' }} className='font-weight-bold col-2' htmlFor="telefono">Rubro</p>
            <div className='col-6'>{this.renderRubro()}</div>
          </div>

          <div className='row'>
            <p style={{ paddingLeft: 0, textAlign: 'right' }} className='font-weight-bold col-2' htmlFor="descripcion">Descripción</p>
            <div className='col-6'>{this.renderDescripcion()}</div>
          </div>

          {this.mostrarUbicacion()}

          <div style={{ width: '500px', justifyContent: 'center', display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
            {this.props.sinModificar
              ? ""
              : <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>}
          </div>
        </div>
        <div style={{ width: '500px', justifyContent: 'center', display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
          <Link to={link}>
            <button className='btn btn-primary'>Ver actividades patrocinadas</button>
          </Link>
        </div>
      </Card>
    );
  }
}
ConsultarPerfilEmpresa.propTypes = perfilPropTypes;

export default ConsultarPerfilEmpresa;