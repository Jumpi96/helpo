import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import { connect } from "react-redux";
import {auth} from "../../../src/actions";
import { getImagen } from '../../utils/Imagen';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component { 
  
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger" hidden>0</Badge></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
            {this.props.auth.user.nombre} <img src={getImagen(this.props.auth.user.avatar)} className="img-avatar" alt="" /> {/*ACA DEBERIA IR LA FOTO DE PERFIL DEL USUARIO*/}
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Perfil</strong></DropdownItem>
              <Link to="/perfil/"><DropdownItem onClick={this.consultarPerfil}><i className="fa fa-user"></i>Mi perfil</DropdownItem></Link>{/*Deberia rutear a la consulta de perfil generico*/}
              <DropdownItem><i className="fa fa-bell-o"></i> Notificaciones<Badge color="info" hidden>0</Badge></DropdownItem>
              <Link to="/ajustes/"><DropdownItem><i className="fa fa-wrench"></i> Ajustes</DropdownItem></Link>
              <DropdownItem onClick={() => this.props.logout()}><i className="fa fa-lock"></i> Cerrar sesión</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" hidden />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      return dispatch(auth.logout());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);