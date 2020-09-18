import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Card, CardHeader, Button, CardBody, CardColumns, CardTitle, CardText, Tooltip } from 'reactstrap';
import { getImagen } from '../../../utils/Imagen'

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    gender: PropTypes.string,
    last_name: PropTypes.string,
    birth_date: PropTypes.string,
    phone: PropTypes.string,
    profession: PropTypes.string,
    experience: PropTypes.string,
    educational_level: PropTypes.string,
    availability: PropTypes.string,
    modality: PropTypes.number,
    state: PropTypes.number,
    city: PropTypes.string,
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    interests: PropTypes.array,
    skills: PropTypes.array,
    manos: PropTypes.number,
    eventos: PropTypes.number
  }),
  switchToModificar: PropTypes.func.isRequired,
  sinModificar: PropTypes.bool
}

class ConsultarPerfilVoluntario extends Component {
  constructor(props) {
    super(props);
    this.toggleEventos = this.toggleEventos.bind(this);
    this.toggleManos = this.toggleManos.bind(this);
    this.state = {
      tooltipManos: false,
      tooltipEventos: false,
    }
  }

  renderSexo() {
    if (this.props.data.gender === "" || this.props.data.gender === null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    const gender = this.props.data.gender[0].toUpperCase() + this.props.data.gender.slice(1);
    return <p>{gender}</p>
  }

  renderApellido() {
    if (this.props.data.last_name == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.last_name}</p>
  }

  renderList(selectedInterests, options) {
    if (selectedInterests.length === 0) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    let optionsToRender = [];
    options.forEach(function (o) {
      if (selectedInterests.indexOf(o.id) >= 0) {
        optionsToRender.push(o);
      }
    });
    return (
      <ul className="list-group">
        {optionsToRender.map(i => <li><p>{i.nombre}</p></li>)}
      </ul>
    )
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.phone == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.phone}</p>
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

  renderValueFromOptions(inputData, options) {
    if (inputData == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    let selected;
    options.forEach(function (o) {
      if (o.id === inputData) {
        selected = o;
      }
    });
    return <p>{selected.nombre}</p>
  }

  renderTextValue(inputData) {
    if (inputData === "") {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {inputData}</p>
  }

  renderBirthDate() {
    if (this.props.data.birth_date == null) {
      return <p className='text-muted'> No hay valor ingresado</p>
    }
    return <p> {moment(this.props.data.birth_date, "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
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
            <div className="col-md">
              <div className="row">
                <div className="col-md-2"><i style={{ color: "#A9A9A9" }}>Voluntario</i></div>
              </div>
              <div className="row" style={{ marginBottom: '5%' }}>
                <div className="col-md-9">
                  <p style={{ textAlign: 'left' }} className='h4'>{this.props.nombre}{this.renderApellido()}</p>
                </div>
                <div className="col-md-3">
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
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="profession">Fecha de nacimiento</p>
                </div>
                <div className="col-md-4">
                  <p>{this.renderBirthDate()}</p>
                </div>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="sexo">Género</p>
                </div>
                <div className="col-md-4">
                  {this.renderSexo()}
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="telefono">Teléfono</p>
                </div>
                <div className="col-md-4">
                  {this.renderTelefono()}
                </div>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="mail">Mail</p>
                </div>
                <div className="col-md-4">
                  <p>{this.props.email}</p>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ paddingLeft: 0, textAlign: 'left' }} className='font-weight-bold' htmlFor="state">Provincia</p>
                </div>
                <div className="col-md-4">
                  {this.renderValueFromOptions(this.props.data.state, this.props.states)}
                </div>
                <div className="col-md-2">
                  <p style={{ paddingLeft: 0, textAlign: 'left' }} className='font-weight-bold' htmlFor="city">Ciudad</p>
                </div>
                <div className="col-md-4">
                  <p>{this.renderTextValue(this.props.data.city)}</p>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="educational_level">Nivel educativo</p>
                </div>
                <div className="col-md-4">
                <p>{this.renderTextValue(this.props.data.educational_level)}</p>
                </div>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="profession">Profesión</p>
                </div>
                <div className="col-md-4">
                  <p>{this.renderTextValue(this.props.data.profession)}</p>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ paddingLeft: 0, textAlign: 'left' }} className='font-weight-bold' htmlFor="gustos">Áreas de interés</p>
                </div>
                <div className="col-md-4">
                  {this.renderList(this.props.data.interests, this.props.interests)}
                </div>
                <div className="col-md-2">
                  <p style={{ paddingLeft: 0, textAlign: 'left' }} className='font-weight-bold' htmlFor="habilidades">Habilidades</p>
                </div>
                <div className="col-md-4">
                  {this.renderList(this.props.data.skills, this.props.skills)}
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="availability">Disponibilidad horaria</p>
                </div>
                <div className="col-md-4">
                <p>{this.renderTextValue(this.props.data.availability)}</p>
                </div>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="modality">Modalidad</p>
                </div>
                <div className="col-md-4">
                  <p>{this.renderValueFromOptions(this.props.data.modality, this.props.modalities)}</p>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-2">
                  <p style={{ textAlign: 'left' }} className='font-weight-bold' htmlFor="experience">Experiencia en voluntariado</p>
                </div>
                <div className="col-md-4">
                  <p>{this.renderTextValue(this.props.data.experience)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '10px' }} className='row offster-md-4'>
                <div class='col-md-4'>
                  {this.props.sinModificar ? "" : <Button onClick={this.props.switchToModificar} color='primary'>Modificar datos</Button>}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <CardColumns>
                <Card id="cardManos" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                  <CardTitle><i class="fa fa-hand-stop-o fa-2x"></i></CardTitle>
                  <CardText style={{ fontSize: 20 }}>{this.renderManos()}</CardText>
                  <Tooltip placement="top" isOpen={this.state.tooltipManos} target="cardManos" toggle={this.toggleManos}>
                    Manos acumuladas
                </Tooltip>
                </Card >    
                <Card id="cardEventos" className="text-center" body inverse color="primary" style={{ height: 100, width: 100, borderColor: 'white' }}>
                  <CardTitle><i class="fa fa-calendar-check-o fa-2x"></i></CardTitle>
                  <CardText style={{ fontSize: 20 }}>{this.renderEventos()}</CardText>
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