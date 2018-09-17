import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import { getImagen } from '../../utils/Imagen';
import BotonSuscripcion from '../Suscripcion/BotonSuscripcion/BotonSuscripcion'

class OrganizacionCard extends Component {
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
    const card = { style: '', bgColor: '' };

    if (variant === 'inverse') {
      card.style = 'text-white';
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);

    const organizacion = this.props.organizacion;
    return (
      <Card className={classes} {...attributes}>
        <CardBody>
          <div>
            <img
              src={getImagen(organizacion ? organizacion.usuario.avatar : undefined)}
              alt="ONG"
              style={{ width: '75px', height: '75px' }}
            />
            <div className="h4 m-0">{organizacion.usuario.nombre}</div>

            <div>{organizacion.descripcion}</div>
            <Link to={this.props.link}>
              <button className="btn btn-primary pull-right" >
                + Ver perfil
                </button>
            </Link>
            <BotonSuscripcion organizacion={organizacion.usuario.id}/>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default OrganizacionCard;