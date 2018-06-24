import React from 'react';  
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';

class EventoView extends React.Component {  
  render() {
    return (
      <div className="col-md-8 col-md-offset-2">
        <h1>{this.props.evento.nombre}</h1>
      </div>
    );
  }
};

EventoView.propTypes = {  
  evento: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {  
  let evento = {nombre: ''};
  const eventoId = ownProps.id;
  console.log(state.eventos);
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
  }
  return {evento: evento};
}

export default connect(mapStateToProps)(EventoView);  