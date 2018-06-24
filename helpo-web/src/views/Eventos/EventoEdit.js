import React from 'react';
import { PropTypes } from 'prop-types';

const EventoEdit = ({rubros}) => {  
  return (
      <div>
      <h1>aja</h1>
      <ul className="list-group">
        {rubros.map(rubro => 
          <li className="list-group-item" key={rubro.id}>
            {rubro.nombre}
          </li>
        )}
      </ul>
      </div>
  );
};

EventoEdit.propTypes = {  
  rubros: PropTypes.array.isRequired  
};

export default EventoEdit;  