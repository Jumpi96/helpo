import React from 'react';
import { Col, Row, Badge } from 'reactstrap';
import OrganizacionCard from './OrganizacionCard';

class OrganizacionesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      error:'',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buscarOrganizacoines = this.buscarOrganizacoines.bind(this);


  }

    
  
  sortOrganizaciones(organizaciones) { // Aca implementar el buscador.
    return organizaciones.sort(function(a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
      keyB = new Date(b.fecha_hora_inicio);
      if(keyA < keyB) return 1;
      if(keyA > keyB) return -1;
      return 0;
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  buscarOrganizacoines(organizaciones){
    if(this.state.nombre !== ''){
      var organizacionesFiltradas = organizaciones.find(organizaciones.nombre.toLowerCase().includes(this.state.nombre));
      return organizacionesFiltradas;
    }
    else return organizaciones;
  }

  render() {
    const organizaciones = this.buscarOrganizaciones(this.props.organizaciones);
    return (
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Buscar</label>
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

          <div className="col-md-3">
            <Badge color="warning">Buscador...</Badge>
          </div>

          <div className="col-md-9">
            {organizaciones.map(organizacion =>       
                <Col>
                  <OrganizacionCard
                    organizacion={organizacion}
                    key={organizacion.id} footer
                    color="primary" auth={this.props.auth}
                    link={'/perfiles/perfil-organizacion/' + organizacion.id} // Ver que link va
                  />
                </Col>
              )}
            </div>

          </Row>
        );

  } 

};

export default OrganizacionesList;  