import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardBody, Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import { getImagen } from '../../../../utils/Imagen';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  smallText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
  link: PropTypes.string,
};

class EventoCard extends Component {

  getNecesidades() {
    const arrayNecesidades = this.props.evento.necesidades ? this.props.evento.necesidades : [];
    const necesidades = arrayNecesidades.slice(0, 2).map((necesidad) => {
      return (
        <li class="list-group-item d-flex justify-content-between align-items-center">
          {
            necesidad.recurso.categoria.nombre + ' - ' +
            necesidad.recurso.nombre
          }
          <span class="badge badge-primary badge-pill">{necesidad.cantidad}</span>
        </li>
      )
      
    });
    return necesidades;
  }

  getVoluntarios() {
    const arrayVoluntarios = this.props.evento.voluntarios ? this.props.evento.voluntarios : [];
    const necesidades = arrayVoluntarios.slice(0, 2).map((voluntario) => {
      return (
        <li class="list-group-item d-flex justify-content-between align-items-center">
          {voluntario.funcion.nombre}
          <span class="badge badge-primary badge-pill">{voluntario.cantidad}</span>
        </li>
      )
    });
    return necesidades;
  }

  getEventoPorcentaje() {
    let contadorNecesidades = 0;
    let contadorCubiertas = 0;
    let contadorTemp = 0;
    const voluntarios = this.props.evento.voluntarios;
    const necesidades = this.props.evento.necesidades;
    if (voluntarios && necesidades) {
      for (let i = 0; i < voluntarios.length; i++) {
        contadorTemp = 0;
        contadorNecesidades += voluntarios[i].cantidad;
        for (let j = 0; j < voluntarios[i].participaciones.length; j++) {
          contadorTemp += voluntarios[i].participaciones[j].cantidad;
        }
        contadorCubiertas += contadorTemp;
      }
      for (let i = 0; i < necesidades.length; i++) {
        contadorTemp = 0;
        contadorNecesidades += necesidades[i].cantidad;
        for (let j = 0; j < necesidades[i].colaboraciones.length; j++) {
          contadorTemp += necesidades[i].colaboraciones[j].cantidad;
        }
        contadorCubiertas += contadorTemp;
      }
    }
    return contadorNecesidades > 0 ? (contadorCubiertas/contadorNecesidades) * 100 : 0;
  }

  render() {
    const { 
      evento,
      className, 
      cssModule, 
      children, 
      variant, 
      link,
      color,
      ...attributes } 
      = this.props;

    // demo purposes only
    const progress = { style: '', color: color, value: this.getEventoPorcentaje()};
    const card = { style: '', bgColor: '' };

    if (variant === 'inverse') {
      progress.style = 'progress-white';
      progress.color = '';
      card.style = 'text-white';
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames('progress-xs my-3', progress.style);

    return (
      <Card className={classes} {...attributes}>
        <CardBody>
        <div>
          <img
            src={getImagen(evento.organizacion ? evento.organizacion.avatar : undefined )}
            alt="ONG"
            style={{width:'75px', height:'75px'}} 
          />
          <div className="h4 m-0">{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY')}</div>
          <div>
            {evento.organizacion ?
              evento.nombre + ' - ' + evento.organizacion.nombre : undefined
            }
          </div>
          <Progress className={progress.style} color={progress.color} value={progress.value} />
          <div className="col-md-6">
            <ul className="list-group">
              {this.getNecesidades()}
              {this.getVoluntarios()}
            </ul>
          </div>
          
          <Link to={link}>
            <button className="btn btn-primary pull-right">
              + Ver más
            </button>
          </Link>
        </div>
        </CardBody>
      </Card>
    );
  }
}

EventoCard.propTypes = propTypes;

export default EventoCard;
