import React from 'react';
import { Col, Row, Badge } from 'reactstrap';
import OrganizacionCard from './OrganizacionCard';

class OrganizacionesList extends React.Component {
  
  sortOrganizaciones(organizaciones) { // Aca implementar el buscador.
    return organizaciones.sort(function(a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
      keyB = new Date(b.fecha_hora_inicio);
      if(keyA < keyB) return 1;
      if(keyA > keyB) return -1;
      return 0;
    });
  }

  render() {

    if (this.props.organizaciones.length > 0) {
      const organizaciones = this.props.organizaciones; // ES PARA CUANDO SE IMPLEMENTE EL BUSCADOR this.sortorganizaciones(this.props.organizaciones);
      return (
        <Row>

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
    
    else {
      return <p>Cargando...</p>
    }

  } 

};

export default OrganizacionesList;  