import React from 'react';
import { Col, Row } from 'reactstrap';
import { PropTypes } from 'prop-types';
import EventoCard from './EventoCard/EventoCard';

class ConsultarEventosList extends React.Component {

  sortEventos(eventos) {
    return eventos.sort(function (a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
        keyB = new Date(b.fecha_hora_inicio);
      if (keyA > keyB) return 1;
      if (keyA < keyB) return -1;
      return 0;
    });
  }

  getLink(evento) {
    if (localStorage.getItem("token") !== null) {
      return '/actividades/consultar-evento?id=' + evento.id;
    } else {
      return '/noAuth/actividades/consultar-evento?id=' + evento.id;
    }
  }

  getEventos(eventos) {
    if (eventos) {
      if (eventos.length <= 3) {
        return (
          <div>
            {/* Si veo actividades pasadas, no recomiendo */}
            {this.props.auth && !this.props.verAntiguos ? 
              <h3>Recomendaciones para vos</h3> : undefined
            }
            {eventos.map(evento =>
              <Row>
                <Col>
                  <EventoCard
                    evento={evento}
                    key={evento.id} footer
                    color="primary"
                    link={this.getLink(evento)}
                  />
                </Col>
              </Row>
            )}
          </div>
        )
      } else {
        return (
          <div>
            {this.props.auth && !this.props.verAntiguos ? 
              <h3>Recomendaciones para vos</h3> : undefined
            }
            {eventos.slice(0, 3).map(evento =>
              <Row>
                <Col>
                  <EventoCard
                    evento={evento}
                    key={evento.id} footer
                    color="primary"
                    link={this.getLink(evento)}
                  />
                </Col>
              </Row>
            )}
            {this.props.auth && !this.props.verAntiguos ? 
              <h3>Otras actividades sociales</h3> : undefined
            }
            {eventos.slice(3).map(evento =>
              <Row>
                <Col>
                  <EventoCard
                    evento={evento}
                    key={evento.id} footer
                    color="primary"
                    link={this.getLink(evento)}
                  />
                </Col>
              </Row>
            )}
          </div>
        )
      }
    }
  }

  render() {
    if (this.props.eventos.length > 0) {
      const eventos = this.props.eventos;//this.sortEventos(this.props.eventos);
      return (
        <div>
          {this.getEventos(eventos)}
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