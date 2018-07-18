import React from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import { PropTypes } from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import ModalEliminarItem from '../../common/ModalEliminarItem/ModalEliminarItem';
import * as eventoActions from '../../../actions/eventoActions';
import './Eventos.css';
import ong from '../../../assets/img/ong.png';

class ConsultarEventosView extends React.Component {  
  render() {
    if (this.props.evento.nombre) {
      const evento = this.props.evento;
      let listaContactos, listaNecesidades, listaVoluntarios;
      if (evento.contacto.length > 0) {
        listaContactos = evento.contacto.map((contacto) => 
          <li class="col-md-6 list-group-item">{contacto.nombre} - {contacto.email} - {contacto.telefono}</li>
        );
      }
      return (
        <div className="animated fadeIn">
          <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Colaborar en {evento.nombre} - {evento.organizacion.nombre}
          </CardHeader>
          <CardBody>
            <h1 id="titulo">
              <img
                src={ong}
                alt={evento.organizacion.nombre}
                style={{width:'75px', height:'75px'}} 
              />
              {' ' + evento.nombre}
            </h1>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Descripción</b>
              </div>
              <div className="form-group col-md-9">
                <p>{evento.descripcion}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Rubro</b>
              </div>
              <div className="form-group col-md-9">
                <p>{evento.rubro.nombre}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de inicio</b>
              </div>
              <div className="form-group col-md-9">
                <p>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-3">
                <b className="float-right">Fecha de finalización</b>
              </div>
              <div className="form-group col-md-9">
              <p>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
            {listaContactos ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b name="contactos" className="float-right">Contactos</b>
                </div>
                <div className="form-group col-md-9">
                  <ul class="list-group">{listaContactos}</ul>
                </div>
              </div>
              ) : undefined
            }
            {listaNecesidades ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b className="float-right">Necesidades materiales</b>
                </div>
                <div className="form-group col-md-9">
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Categoría</th>
                        <th>Ítem</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {undefined}
                    </tbody>
                  </Table>
                </div>
              </div>
              ) : undefined
            }
            {listaVoluntarios ? (
              <div className="row">
                <div className="form-group col-md-3">
                  <b className="float-right">Voluntarios</b>
                </div>
                <div className="form-group col-md-9">
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Ítem</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {undefined}
                    </tbody>
                  </Table>
                </div>
              </div>
              ) : undefined
            }
            <button 
              onClick={this.toggleEdit} 
              hidden={moment(evento.fecha_hora_inicio)<=moment()}
              className="btn btn-warning offset-md-10"
            >
              Colaborar
            </button>            
          </CardBody>
        </Card>
      </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
};

ConsultarEventosView.propTypes = {  
  evento: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {  
  let evento = {
    nombre: '',
    descripcion: '',
    rubro: {},
    fecha_hora_inicio: new Date(),
    fecha_hora_fin: new Date(),
    ubicacion: { latitud: '', longitud: '', notas: '' },
    contacto: [{
      nombre: '',
      mail: '',
      telefono: '',
      contactId: '1',
    }],
    nextId: '2'
  };
  const eventoId = ownProps.match.params.id;
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
    evento.rubro_id = evento.rubro.id;
    evento.nextId = evento.contacto.length + 1;
    for (let i=0; i < evento.contacto.length; i++) {
      evento.contacto[i].contactId = i+1;
    }
  }
  return {evento: evento};
}

function mapDispatchToProps(dispatch) {  
  return {
    actions: bindActionCreators(eventoActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarEventosView);