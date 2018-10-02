import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader , Tooltip, Button, CardTitle, CardText, CardBody, CardColumns } from 'reactstrap';
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
    manos: PropTypes.number,
    eventos: PropTypes.number,
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
    this.renderManos = this.renderManos.bind(this);
    this.renderEventos = this.renderEventos.bind(this);
    this.toggleEventos = this.toggleEventos.bind(this);
    this.toggleManos = this.toggleManos.bind(this);
    this.state = {
      tooltipManos: false,
      tooltipEventos: false,
    }
  }

  renderSexo() {
    if (this.props.data.sexo == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.sexo}</p>      
  }

  renderApellido() {
    if (this.props.data.apellido == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.apellido}</p>      
  }

  renderGustos() {
    if (this.props.data.gustos == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.gustos}</p>      
  }

  renderHabilidades() {
    if (this.props.data.habilidades == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.habilidades}</p>      
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.telefono}</p>      
  }

  renderDni() {
    if (this.props.data.dni == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.dni}</p>      
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

  render() {    
    return (      
      <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> Perfil
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-8">
            <div className="row" style={{ height: '110px'}}>
              <div className="col-md-3">
                <p style={{ textAlign: 'right' }} className='h4'>{this.props.nombre}{this.renderApellido()}</p>
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
              </div>
            </div>
            <div className='row'>
              <div className="col-md-3">
                <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="dni">DNI</p>
              </div>
              <div className="col-md-5">
                {this.renderDni()} 
              </div>
            </div>
            <div className='row'>
              <div className="col-md-3">
                <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="sexo">Sexo</p>
              </div>
              <div className="col-md-5">
                {this.renderSexo()} 
              </div>
            </div>
            <div className='row'>
              <div className="col-md-3">
              <p style={{ paddingLeft: 0 ,textAlign: 'right' }} className='font-weight-bold' htmlFor="gustos">Gustos</p> 
              </div>
              <div className="col-md-5">
                {this.renderGustos()} 
              </div>
            </div>
            <div className='row'>
              <div className="col-md-3">
              <p style={{ paddingLeft: 0 ,textAlign: 'right' }} className='font-weight-bold' htmlFor="habilidades">Habilidades</p> 
              </div>
              <div className="col-md-5">
                {this.renderHabilidades()} 
              </div>
            </div>
            <div className="row">
              <div class="col-md-5 col-md-offset-3">
                <div style={{ width: '500px', justifyContent: 'center' ,display: 'flex', marginBottom: '10px' }} class='row offster-md-4'>          
                  {this.props.sinModificar ? "" : <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>}
                </div>
              </div>
            </div>
          </div>  
          <div className="col-md-4">
            <CardColumns>
              <Card id="cardManos" className="text-center" body inverse color="primary" style={{height:100, width:100, borderColor:'white'}}>
                <CardTitle><i class="fa fa-hand-stop-o fa-2x"></i></CardTitle>
                <CardText style={{fontSize:20}}>{this.renderManos()}</CardText>
                <Tooltip placement="top" isOpen={this.state.tooltipManos} target="cardManos" toggle={this.toggleManos}>
                      Manos acumuladas
                </Tooltip>
              </Card >
              <Card id="cardEventos" className="text-center" body inverse color="primary" style={{height:100, width:100,borderColor:'white'}}>
                <CardTitle><i class="fa fa-calendar-check-o fa-2x"></i></CardTitle>
                <CardText style={{fontSize:20}}>{this.renderEventos()}</CardText>
                <Tooltip placement="top" isOpen={this.state.tooltipEventos} target="cardEventos" toggle={this.toggleEventos}>
                    Eventos asistidos
                </Tooltip>
             </Card> 
            </CardColumns>
          </div>
        </div>
      </CardBody>
    </Card>
    );
  }
}
ConsultarPerfilVoluntario.propTypes = perfilPropTypes;

export default ConsultarPerfilVoluntario;