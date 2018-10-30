import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppNavbarBrand } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class NoAuthHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="#noAuth/dashboard">Inicio</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#noAuth/actividades/consultar-eventos">Actividades sociales</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#noAuth/organizaciones">Organizaciones</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="px-3">
            <Link className="btn btn-primary" to="/login">Iniciar sesión</Link>
          </NavItem>
          <NavItem className="px-3">
            <Link className="btn btn-primary" to="/register">Registrarse</Link>
          </NavItem>
        </Nav>
      </React.Fragment>
    );
  }
}

NoAuthHeader.propTypes = propTypes;
NoAuthHeader.defaultProps = defaultProps;

export default NoAuthHeader;
