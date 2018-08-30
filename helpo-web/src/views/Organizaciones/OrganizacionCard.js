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

OrganizacionCard.propTypes = propTypes;

export default OrganizacionCard;
