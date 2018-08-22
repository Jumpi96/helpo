import React from 'react';
import { Col, Row, Badge } from 'reactstrap';
import { PropTypes } from 'prop-types';
import EventoCard from './EventoCard/EventoCard';

class ConsultarEventosList extends React.Component {
  
  sortEventos(eventos) {
    return eventos.sort(function(a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
      keyB = new Date(b.fecha_hora_inicio);
      if(keyA < keyB) return 1;
      if(keyA > keyB) return -1;
      return 0;
    });
  }

  render() {
    if (this.props.eventos.length > 0) {
      const eventos = this.sortEventos(this.props.eventos);
      return (
        <Row>
          <div className="col-md-3">
            <Badge color="warning">Próximamente...</Badge>
          </div>
          <div className="col-md-9">
            {eventos.map(evento =>       
                <Col>
                  <EventoCard
                    evento={evento}
                    key={evento.id} footer
                    color="primary" auth={this.props.auth}
                    link={'/actividades/consultar-evento/' + evento.id}
                  />
                </Col>
              )}
            </div>
          </Row>
        );
    } else {
      return <p>Cargando...</p>
    }
  }  
};

ConsultarEventosList.propTypes = {  
  eventos: PropTypes.array.isRequired
};

export default ConsultarEventosList;  