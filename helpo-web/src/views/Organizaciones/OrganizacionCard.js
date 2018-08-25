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

class organizacionCard extends Component {


  getVoluntarios() {
    const arrayVoluntarios = this.props.organizacion.voluntarios ? this.props.organizacion.voluntarios : [];
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

  getorganizacionPorcentaje() {
    let contadorNecesidades = 0;
    let contadorCubiertas = 0;
    let contadorTemp = 0;
    const voluntarios = this.props.organizacion.voluntarios;
    const necesidades = this.props.organizacion.necesidades;
    if (voluntarios && necesidades) {
      for (let i = 0; i < voluntarios.length; i++) {
        contadorNecesidades += voluntarios[i].cantidad;
        contadorCubiertas += voluntarios[i].participaciones.length;
      }
      for (let i = 0; i < necesidades.length; i++) {
        contadorTemp = 0;
        contadorNecesidades += necesidades[i].cantidad;
        for (let j = 0; j < necesidades[i].colaboraciones; i++) {
          contadorTemp += necesidades[i].colaboraciones[j].cantidad;
        }
        contadorCubiertas += contadorTemp;
      }
    }
    return contadorNecesidades > 0 ? (contadorCubiertas/contadorNecesidades) * 100 : 0;
  }

  render() {
    const { 
      organizacion,
      className, 
      cssModule, 
      children, 
      variant, 
      link,
      color,
      ...attributes } 
      = this.props;

    // demo purposes only
    const progress = { style: '', color: color, value: this.getorganizacionPorcentaje()};
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
            src={getImagen(organizacion.organizacion ? organizacion.organizacion.avatar : undefined )}
            alt="ONG"
            style={{width:'75px', height:'75px'}} 
          />
          
          <div>
            {organizacion.organizacion ?
              organizacion.nombre + ' - ' + organizacion.organizacion.nombre : undefined
            }
          </div>

          <div className="col-md-6">
            <ul className="list-group">
              {this.getNecesidades()}
              {this.getVoluntarios()}
            </ul>
          </div>
          
          <Link to={link}> 
            <button className="btn btn-primary pull-right" hidden={!this.props.auth}>
              + Ver perfil
            </button>
          </Link>

        </div>
        </CardBody>
      </Card>
    );
  }
}

organizacionCard.propTypes = propTypes;

export default organizacionCard;
