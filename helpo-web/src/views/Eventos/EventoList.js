import React from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';

class EventoList extends React.Component {
  
  render() {
    const eventos = this.props.eventos;
    return (
      <ul className="list-group">
        {eventos.map(evento => 
          <li className="list-group-item" key={evento.id}><Link to={'/actividades/evento/' + evento.id}>{evento.nombre}</Link></li>
        )}
      </ul>
    );
  }
  
};

EventoList.propTypes = {  
  eventos: PropTypes.array.isRequired
};

export default EventoList;  