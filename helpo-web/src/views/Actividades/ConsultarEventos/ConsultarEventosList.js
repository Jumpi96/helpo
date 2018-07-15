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
    const eventos = this.sortEventos(this.props.eventos);
    return (
      <div className="offset-md-3">
        {eventos.map(evento => 
          <Row>
            <Col>
              <EventoCard
                evento={evento}
                key={evento.id} footer
                mainText={evento.nombre + ' - Nombre de ONG'} 
                color="primary" 
                link={'/actividades/consultar-evento/' + evento.id}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
  
};

ConsultarEventosList.propTypes = {  
  eventos: PropTypes.array.isRequired
};

export default ConsultarEventosList;  