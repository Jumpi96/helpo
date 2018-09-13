import React from 'react';
import { Col, Row } from 'reactstrap';
import OrganizacionCard from './OrganizacionCard';

class OrganizacionesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      error: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buscarOrganizaciones = this.buscarOrganizaciones.bind(this);
    this.getLink = this.getLink.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  buscarOrganizaciones(organizaciones) {
    if (this.state.nombre !== '') {
      const organizacionesFiltradas = organizaciones.filter(organizacion => this.contieneNombre(organizacion));
      return organizacionesFiltradas;
    }
    else return organizaciones;
  }

  contieneNombre(organizacion) {
    return organizacion.usuario.nombre.toLowerCase().includes(this.state.nombre.toLowerCase())
  }

  getLink(organizacion) {
    if (this.props.auth.isAuthenticated) {
      return '/perfil/' + organizacion.usuario.id;
    }
    return '/noAuth/perfil/' + organizacion.usuario.id;
  }

  render() {
    const organizaciones = this.buscarOrganizaciones(this.props.organizaciones);
    return (
      <div className="row">
        <div className="form-group col-md-4">
          <label for="nombre">Buscar una organización</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            placeholder="Ingrese el nombre de una ONG"
            value={this.state.nombre}
            onChange={this.handleInputChange}
          />
          <span style={{ color: 'red' }}>{this.state.error}</span>
        </div>
        <div className="col-md-8">
          {organizaciones.map(organizacion =>
            <Row>
              <Col>
                <OrganizacionCard
                  organizacion={organizacion}
                  key={organizacion.id} footer
                  color="primary" auth={this.props.auth}
                  link={this.getLink(organizacion)} // Ver que link va
                />
              </Col>
            </Row>
          )}
        </div>
      </div>
    );
  }
};

export default OrganizacionesList;  