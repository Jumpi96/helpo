import React from 'react';
import { Col, Row } from 'reactstrap';
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
        <div>
          <Row>
            {eventos.map(evento =>       
              <Col>
                <EventoCard
                  evento={evento}
                  key={evento.id} footer
                  color="primary" auth={this.props.auth}
                  link={'/actividades/consultar-evento?id=' + evento.id} 
                />
              </Col>
            )}
          </Row>
        </div>
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