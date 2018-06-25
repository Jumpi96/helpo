import React from 'react';  
import { PropTypes } from 'prop-types';
import * as eventoActions from '../../actions/eventoActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import EventoForm from './EventoForm';

class EventoView extends React.Component {  
  constructor(props) {
    super(props);
    this.state = { 
      isEditing: false,
      evento: this.props.evento,
      saving: false
    }
    this.updateEventoState = this.updateEventoState.bind(this);
    this.saveEvento = this.saveEvento.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
    this.setState({ isEditing: true });
  }

  saveEvento(e) {
    e.preventDefault();
    this.props.actions.updateEvento(this.state.evento);
  }

  updateEventoState(e) {
    const field = e.target.name;
    const evento = this.state.evento;
    evento[field] = e.target.value;
    return this.setState({evento: evento});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.evento.id !== nextProps.evento.id) {
      this.setState({evento: nextProps.evento});
    }
    this.setState({saving: false, isEditing: false});
  }

  render() {
    if (this.state.isEditing) {
      return (
        <div>
          <h1>Editar evento</h1>
          <EventoForm 
            evento={this.state.evento} 
            onSave={this.saveEvento} 
            onChange={this.updateEventoState} 
            saving={this.state.saving}
          /> 
        </div>
      )
    }
    return (
      <div className="col-md-8 col-md-offset-2">
        <h1>{this.state.evento.nombre}</h1>
        <button onClick={this.toggleEdit}>Editar</button>
      </div>
    );
  }
};

EventoView.propTypes = {  
  evento: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {  
  let evento = {
    nombre: '',
    descripcion: '',
    rubro_id: 0,
    fecha_hora_inicio: new Date(),
    fecha_hora_fin: new Date(),
    ubicacion: { latitud: '', longitud: '', notas: '' },
    contactos: []
  };
  const eventoId = ownProps.match.params.id;
  if (state.eventos.length > 0) {
    evento = Object.assign({}, state.eventos.find(evento => "" + evento.id === eventoId))
  }
  return {evento: evento};
}

function mapDispatchToProps(dispatch) {  
  return {
    actions: bindActionCreators(eventoActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventoView);