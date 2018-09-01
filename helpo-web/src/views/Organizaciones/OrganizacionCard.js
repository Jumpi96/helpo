import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getImagen } from '../../utils/Imagen';

class OrganizacionCard extends Component {
  render() {
    const organizacion = this.props.organizacion;
    return (
      <Card>
        <CardBody>
        <div>
          <img
            className="col-md-3"
            src={getImagen(organizacion ? organizacion.usuario.avatar : undefined )}
            alt="ONG"
            style={{width:'75px', height:'75px'}} 
          />

          <div >
            <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="nombre">{organizacion.usuario.nombre}</p>
          </div>
          
          <div>
            <p style={{ textAlign: 'right' }} className='font-weight-bold' htmlFor="mail">{organizacion.descripcion}</p>
          </div>

        <div className="col-6">
          <Link to={this.props.link}> 
            <button className="btn btn-primary pull-right" > 
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

export default OrganizacionCard;