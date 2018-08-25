import React from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import { connect } from "react-redux";
import moment from 'moment';
import api from '../../../api';
import './organizaciones.css';
import ong from '../../../assets/img/ong.png';
import { getImagen } from '../../../utils/Imagen';
import Comentariosorganizacion from './Comentariosorganizacion/Comentariosorganizacion';

class Organizaciones extends React.Component {  

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      organizaciones: []
    }
    this.toggleColaborar = this.toggleColaborar.bind(this);
    this.loadorganizacion = this.loadorganizacion.bind(this);
  }

  loadOrganizacion() { // Puede usarse 
    api.get('/actividades/consulta_organizaciones/' + this.state.organizacion.id + '/')
      .then(res => {
        this.setState({ organizacion: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  componentDidMount() { // Ver como solucionar esto, falta la vista de la API
    api.get(`/perfiles/perfil_organizacion/*`)
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

  toggleColaborar() {
    this.props.history.push({ 
      pathname: '/actividades/registrar-colaboraciones', 
      search: '?organizacion=' + this.state.organizacion.id,
    });
  }

  esVoluntario() {
    return this.props.auth.user.user_type === 2;
  }

  renderEventos(){
    const eventos = this.props.eventos;
    if(organizaciones.length === 0){
      return(
        <div className="row">
          <div className="form-group col-md-6 col-md-offset-3">
            <label>&emsp;Todav&iacute;a no hay organizaciones registradas</label>
          </div>
        </div>
      )
    }
    else{
      return(
        <CardBody>
            <ConsultarEventosList eventos={eventos} auth={this.getAuth()} />
        </CardBody>
      )
    }
  }



  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Organizaciones 
          </CardHeader>
          {this.renderEventos()}
        </Card>
      </div>
    );
  }



  render() {
      if (this.state.organizaciones.length > 0) {
        const organizaciones = this.sortorganizaciones(this.props.organizaciones);
        return (
      
        <div className="animated fadeIn">
          <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Organizaciones
          </CardHeader>

          <CardBody>
            <h1 id="titulo">
              <img
                src={getImagen(organizacion.organizacion ? organizacion.organizacion.avatar : ong )}
                alt={organizacion.organizacion.nombre}
                style={{width:'75px', height:'75px'}} 
              />
              {' ' + organizacion.nombre}
            </h1>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Descripción</b>
              </div>
              <div className="form-group col-md-9">
                <p>{organizacion.descripcion}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Rubro</b>
              </div>
              <div className="form-group col-md-9">
                <p>{organizacion.rubro.nombre}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de inicio</b>
              </div>
              <div className="form-group col-md-9">
                <p>{moment(organizacion.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de finalización</b>
              </div>
              <div className="form-group col-md-9">
              <p>{moment(organizacion.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            
          </CardBody>

        </Card>
      </div>

    } 
    else{
      return(
        <div className="row">
        <div className="form-group col-md-6 col-md-offset-3">
          <label>&emsp;Todav&iacute;a no hay organizaciones registradas</label>
        </div>
      </div>
      )
    }

};

}
  
export default Organizaciones;