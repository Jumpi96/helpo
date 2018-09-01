import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, CardBody, Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import { getImagen } from '../../utils/Imagen';

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

class OrganizacionCard extends Component {
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

    return (
      <Card>
        <CardBody>
        <div>
          <img
            className="col-md-3"
            src={getImagen(organizacion ? organizacion.avatar : undefined )}
            alt="ONG"
            style={{width:'75px', height:'75px'}} 
          />
          
          <div className="col-6">
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="mail">{organizacion.descripcion}</p>
        </div>

        <div className="col-6">
          <Link to={link}> 
            <button className="btn btn-primary pull-right" hidden={!this.props.auth}> 
              + Ver perfil
            </button>
          </Link>
          </div>

        </div>
        </CardBody>
      </Card>
    );
  }
}

OrganizacionCard.propTypes = propTypes;

export default OrganizacionCard;
