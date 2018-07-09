import React from 'react';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import Widget02 from '../Widgets/Widget02';

class EventoList extends React.Component {
  
  render() {
    const eventos = this.props.eventos;
    return (
      <ul className="list-group">
        {eventos.map(evento => 
          <Widget02 
            header={moment(evento.fecha_hora_inicio).format('DD/MM/YYYY')} 
            key={evento.id} footer
            mainText={evento.nombre} 
            icon="fa fa-hand-stop-o" color="primary" 
            link={'/actividades/evento/' + evento.id}
          />
        )}
      </ul>
    );
  }
  
};

EventoList.propTypes = {  
  eventos: PropTypes.array.isRequired
};

export default EventoList;  