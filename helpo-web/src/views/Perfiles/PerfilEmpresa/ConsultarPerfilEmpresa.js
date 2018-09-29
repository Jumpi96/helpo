import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody, CardTitle, CardColumns, Button, Tooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Gmaps, Marker } from 'react-gmaps';
import { getImagen } from '../../../utils/Imagen'
import ModalVerificarCuenta from '../ModalVerificarCuenta/ModalVerificarCuenta';
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
    this.toggle = this.toggle.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.showModalVerificarCuenta = this.showModalVerificarCuenta.bind(this);
    this.getLinkVerEventos = this.getLinkVerEventos.bind(this);
    this.state = {
      tooltipOpen: false,
      popoverOpen: false,
      showModalVerificarCuenta: false,
      modalType: 'success'
    };
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    if (!this.props.data.verificada) {
      return <p>{this.props.data.telefono} <span id="btnVerificar" onClick={this.togglePopover} style={{ borderRadius: '4px' }} className="btn-primary fa fa-pencil fa-fw"></span></p>
    }
    return <p>{this.props.data.telefono}</p>
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

  renderModal() {
    if (this.state.showModalVerificarCuenta) {
      return (
        <ModalVerificarCuenta
          telefono={this.props.data.telefono} id={this.props.id} userType={this.props.userType}
          onSuccess={(verificada) => {
            this.props.data.verificada = verificada;
            this.setState({ showModalVerificarCuenta: false });
          }}
          onCancel={(verificada) => {
            this.props.data.verificada = verificada;
            this.setState({ showModalVerificarCuenta: false });
          }}
        />)
    }
  }

  showModalVerificarCuenta() {
    this.setState({
      showModalVerificarCuenta: true,
    })
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

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  getLinkVerEventos() {
    return '/actividades/consultar-eventos?empresa=' + this.props.id;
  }

  render() {
    const link = this.getLinkVerEventos();
    return (
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Perfil
        </CardHeader>
          <CardBody>
            <div className="row">
              <div className="col-md-8">
                <div className="row" style={{ height: '110px' }}>
                  <div className="col-md-3">
                    <p style={{ textAlign: 'right' }} className='h4'>{this.props.nombre}</p>
                  </div>
                  <div className="col-md-5">
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
                  <div className="col-md-3">
                    <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="mail">Mail</p>
                  </div>
                  <div className="col-md-5">
                    <p>{this.props.email}</p>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-3">
                    <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="telefono">Teléfono</p>
                  </div>
                  <div className="col-md-5">
                    {this.renderTelefono()}
                    {!this.props.data.verificada ?
                      <Popover placement="bottom" isOpen={this.state.popoverOpen} target="btnVerificar" toggle={this.togglePopover}>
                        <PopoverHeader>Confirme su tel&eacute;fono</PopoverHeader>
                        <PopoverBody>Para que su cuenta sea verificada utilizando un segundo factor de su cuenta, haga click <a style={{ textDecoration: "underline", color: "#F39200" }} onClick={this.showModalVerificarCuenta}>aqu&iacute;</a></PopoverBody>
                      </Popover> : undefined}
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-3">
                    <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="cuit">CUIT</p>
                  </div>
                  <div className="col-md-5">
                    {this.renderCuit()}
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-3">
                    <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="telefono">Rubro</p>
                  </div>
                  <div className="col-md-5">
                    {this.renderRubro()}
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-3">
                    <p style={{ paddingLeft: 0, textAlign: 'right' }} className='font-weight-bold' htmlFor="descripcion">Descripción</p>
                  </div>
                  <div className="col-md-5">
                    {this.renderDescripcion()}
                  </div>
                </div>
                {this.mostrarUbicacion()}
                <div style={{ width: '500px', justifyContent: 'center', display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                  <div className="col-md-4">
                    {this.props.sinModificar
                      ? ""
                      : <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>}
                  </div>
                </div>
                <div style={{ width: '500px', justifyContent: 'center', display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                  <div className="col-md-4">
                    <Link to={link}>
                      <button className='btn btn-primary'>Ver eventos patrocinados</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <CardColumns>
                  {/* <Card className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                  <CardTitle><i className="fa fa-hand-stop-o fa-2x"></i></CardTitle>
                  <CardText style={{ fontSize: 20 }}>{this.renderManos()}</CardText>
                </Card >
                <Card className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                  <CardTitle><i className="fa fa-calendar-check-o fa-2x"></i></CardTitle>
                  <CardText style={{ fontSize: 20 }}>{this.renderEventos()}</CardText>
                </Card> */}
                  {this.props.data.verificada ?
                    <Card id="cardVerificada" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                      <CardTitle><i className="fa fa-shield fa-3x"></i></CardTitle>
                      <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="cardVerificada" toggle={this.toggle}>
                        Cuenta verificada
                </Tooltip>
                    </Card>
                    : null}
                </CardColumns>
              </div>
            </div>
          </CardBody>
          {this.renderModal()}
        </Card>
    );
  }
}
ConsultarPerfilEmpresa.propTypes = perfilPropTypes;

export default ConsultarPerfilEmpresa;