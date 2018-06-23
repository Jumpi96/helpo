import React from 'react';
import { PropTypes } from 'prop-types';

const EventoList = ({eventos}) => {  
  return (
      <ul className="list-group">
        {eventos.map(evento => 
          <li className="list-group-item" key={evento.id}>
            {evento.nombre}
          </li>
        )}
      </ul>
  );
};

EventoList.propTypes = {  
  eventos: PropTypes.array.isRequired
};

export default EventoList;  