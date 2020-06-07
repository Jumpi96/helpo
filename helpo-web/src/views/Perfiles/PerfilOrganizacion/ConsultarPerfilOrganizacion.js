import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { Card, CardHeader, Button, CardTitle, CardText, CardBody, CardColumns, Tooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { Gmaps, Marker } from 'react-gmaps';
import { connect } from "react-redux";
import { getImagen } from '../../../utils/Imagen'
import BotonSuscripcion from '../../Suscripcion/BotonSuscripcion/BotonSuscripcion'
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
    manos: PropTypes.number,
    eventos: PropTypes.number,
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

class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props);
    this.mostrarUbicacion = this.mostrarUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderManos = this.renderManos.bind(this);
    this.renderEventos = this.renderEventos.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleEventos = this.toggleEventos.bind(this);
    this.toggleManos = this.toggleManos.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.showModalVerificarCuenta = this.showModalVerificarCuenta.bind(this);
    this.getLinkVerEventos = this.getLinkVerEventos.bind(this);
    this.state = {
      tooltipManos: false,
      tooltipEventos: false,
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
    if (!this.props.data.verificada && !this.props.sinModificar) {
      return (
        <div>
          <p>{this.props.data.telefono} <span id="btnVerificar" onClick={this.togglePopover} style={{ borderRadius: '4px' }} className="btn-primary fa fa-pencil fa-fw"></span></p>
          <Popover placement="bottom" isOpen={this.state.popoverOpen} target="btnVerificar" toggle={this.togglePopover}>
            <PopoverHeader>Confirme su tel&eacute;fono</PopoverHeader>
            <PopoverBody>Si desea verificar su cuenta utilizando un segundo factor, haga click <a style={{ textDecoration: "underline", color: "#F39200" }} onClick={this.showModalVerificarCuenta}>aqu&iacute;</a></PopoverBody>
          </Popover>
        </div>
      )
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

  renderManos() {
    if (this.props.data.manos == null) {
      return <p className='text-muted'> - </p>
    }
    return <p> {this.props.data.manos}</p>
  }

  renderEventos() {
    if (this.props.data.eventos == null) {
      return <p className='text-muted'> - </p>
    }
    return <p> {this.props.data.eventos}</p>
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
        <div className="row">
          <div className="form-group col-md-2">
            <b className="float-left">Ubicación</b>
          </div>
          <div className='col-md-9 offset-md-1'>
            <Gmaps
              width={'75%'}
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

  toggleEventos() {
    this.setState({
      tooltipEventos: !this.state.tooltipEventos
    });
  }

  toggleManos() {
    this.setState({
      tooltipManos: !this.state.tooltipManos
    });
  }

  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  getLinkVerEventos() {
    if (this.props.auth.isAuthenticated) {
      return '/actividades/consultar-eventos?organizacion=' + this.props.id;
    }
    return '/noAuth/actividades/consultar-eventos?organizacion=' + this.props.id;
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
              <div className="row">
                <div className="col-md-2"><i style={{ color: "#A9A9A9" }}>ONG</i></div>
              </div>
              <div className="row" style={{ marginBottom: '5%' }}>
                <div className="col-md-3">
                  <p style={{ textAlign: 'left' }} className='h4'>{this.props.nombre}</p>
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
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="mail">Mail</p>
                </div>
                <div className="col-md-5">
                  <p>{this.props.email}</p>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-3">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="telefono">Teléfono</p>
                </div>
                <div className="col-md-5">
                  {this.renderTelefono()}
                </div>
              </div>
              <div className='row'>
                <div className="col-md-3">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="cuit">CUIT/CUIL</p>
                </div>
                <div className="col-md-5">
                  {this.renderCuit()}
                </div>
              </div>
              <div className='row'>
                <div className="col-md-3">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="telefono">Rubro</p>
                </div>
                <div className="col-md-5">
                  {this.renderRubro()}
                </div>
              </div>
              <div className='row'>
                <div className="col-md-3">
                  <p style={{ paddingLeft: 0, textAlign: 'left' }} className='font-weight-bold' htmlFor="descripcion">Descripción</p>
                </div>
                <div className="col-md-5">
                  {this.renderDescripcion()}
                </div>
              </div>
              {this.mostrarUbicacion()}
              <div style={{ display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                <div className="col-md-5 offset-md-3">
                  {this.props.sinModificar
                    ? ""
                    : <Button className='btn btn-primary' onClick={this.props.switchToModificar} color='primary'>Modificar datos</Button>}
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                <div className="col-md-5 offset-md-3">
                  <Link to={link}>
                    <button className='btn btn-primary'>Ver actividades organizadas</button>
                  </Link>
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                <div className="col-md-5 offset-md-3">
                  <BotonSuscripcion organizacion={this.props.id} />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <CardColumns>
                <Card id="cardManos" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                  <CardTitle><i className="fa fa-hand-stop-o fa-2x"></i></CardTitle>
                  <CardText style={{ fontSize: 20 }}>{this.renderManos()}</CardText>
                  <Tooltip placement="top" isOpen={this.state.tooltipManos} target="cardManos" toggle={this.toggleManos}>
                    Manos acumuladas
                  </Tooltip>
                </Card>
                <Link to={link}>
                  <Card id="cardEventos" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                    <CardTitle><i className="fa fa-calendar-check-o fa-2x"></i></CardTitle>
                    <CardText style={{ fontSize: 20 }}>{this.renderEventos()}</CardText>
                    <Tooltip placement="top" isOpen={this.state.tooltipEventos} target="cardEventos" toggle={this.toggleEventos}>
                      Eventos organizados
                    </Tooltip>
                  </Card>
                </Link>
                {this.props.data.verificada ?
                  <Card id="cardVerificada" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                    <CardTitle><i className="fa fa-shield fa-3x"></i></CardTitle>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="cardVerificada" toggle={this.toggle}>
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
ConsultarPerfilOrganizacion.propTypes = perfilPropTypes;

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}
export default connect(mapStateToProps, undefined)(ConsultarPerfilOrganizacion);