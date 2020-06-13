import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import { getImagen } from '../../utils/Imagen';

class VoluntarioCard extends Component {
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

    const voluntario = this.props.voluntario;
    return (
      <Card className={classes} {...attributes}>
        <CardBody>
          <div>
            <img
              src={getImagen(voluntario ? voluntario.avatar.url : undefined)}
              alt="ONG"
              style={{ width: '75px', height: '75px' }}
            />
            <div className="h4 m-0">{voluntario.usuario.nombre} {voluntario.last_name}</div>

            <div>{voluntario.profession}</div>
            <Link to={this.props.link}>
              <button className="btn btn-primary pull-right" >
                + Ver perfil
                </button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default VoluntarioCard;