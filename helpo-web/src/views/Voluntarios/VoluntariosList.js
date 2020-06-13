import React from 'react';
import { Col, Row } from 'reactstrap';
import VoluntarioCard from './VoluntarioCard';

class VoluntariosList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      error: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buscarVoluntarios = this.buscarVoluntarios.bind(this);
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

  buscarVoluntarios(voluntarios) {
    if (this.state.nombre !== '') {
      const voluntariosFiltrados = voluntarios.filter(voluntario => this.contieneNombre(voluntario));
      return voluntariosFiltrados;
    }
    return voluntarios;
  }

  contieneNombre(voluntarios) {
    return voluntarios.usuario.nombre.toLowerCase().includes(this.state.nombre.toLowerCase())
  }

  getLink(voluntario) {
    return '/perfil/' + voluntario.usuario.id;
  }

  render() {
    const voluntarios = this.buscarVoluntarios(this.props.voluntarios);
    return (
      <div className="row">
        <div className="form-group col-md-4">
          <label for="nombre">Buscar un voluntario</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            placeholder={"Ingrese el nombre de un voluntario"}
            value={this.state.nombre}
            onChange={this.handleInputChange}
          />
          <span style={{ color: 'red' }}>{this.state.error}</span>
        </div>
        <div className="col-md-8">
          {voluntarios.map(voluntario =>
            <Row>
              <Col>
                <VoluntarioCard
                  voluntario={voluntario}
                  key={voluntario.id} footer
                  color="primary" auth={this.props.auth}
                  link={this.getLink(voluntario)} // Ver que link va
                />
              </Col>
            </Row>
          )}
        </div>
      </div>
    );
  }
};

export default VoluntariosList;