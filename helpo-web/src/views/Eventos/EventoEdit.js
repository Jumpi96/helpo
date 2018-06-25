import React from 'react';
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';

class EventoEdit extends React.Component {  
  render() {
    const listaRubroEventos = this.props.rubros.map((r) =>
      <option value={r.id}>{r.nombre}</option>
    );
    return (
      <div>
        <h1>aja</h1>
        <select
          value={this.props.evento.rubro.id}
          className="form-control"
          onChange={this.handleChange}>
            {listaRubroEventos}
        </select>
      </div>
  );
  }
  
}

EventoEdit.propTypes = {  
  rubros: PropTypes.array.isRequired  
};

function mapStateToProps(state, ownProps) {  
  let evento = {nombre: '', rubro: { id: undefined}};
  const eventoId = ownProps.id;
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
  }
  return {evento: evento};
}

export default connect(mapStateToProps)(EventoEdit);  