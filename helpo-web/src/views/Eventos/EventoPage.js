import React from 'react';  
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';  
import * as eventoActions from '../../actions/eventoActions';
import * as rubrosEventoActions from '../../actions/rubroEventoActions';
import EventoList from './EventoList';
import EventoEdit from './EventoEdit';
import EventoView from './EventoView';

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventos();
    const urlParams = new URLSearchParams(this.props.location.search)
    if (urlParams.get('id')) { 
      this.state = {
        evento_id: urlParams.get('id'),
        isEditing: true
      }
    } else {
      this.state = { evento_id: undefined }
    }
  }

  render() {
    const eventos = this.props.eventos;
    if (!this.state.evento_id) {
      return (
        <div className="col-md-12">
          <h1>Eventos</h1>
          <EventoList 
            eventos={eventos}/>
        </div>
      )
    } else if(!this.state.isEditing) {
      return (
        <div className="col-md-12">
          <h1>Eventos</h1>
          <EventoView id={this.state.evento_id} />
        </div>
      )
    } else {
      return (
        <div className="col-md-12">
          <h1>Eventos</h1>
          <EventoEdit rubros={this.props.rubrosEvento} />
        </div>
      )
    }
    
  }
}

EventoPage.propTypes = {
  eventos: PropTypes.array.isRequired,
  rubrosEvento: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos,
    rubrosEvento: state.rubrosEvento
  }
} 

const mapDispatchToProps = dispatch => {
    return {
      loadEventos: () => {
        return dispatch(eventoActions.loadEventos());
      },
      loadRubrosEvento: () => {
        return dispatch(rubrosEventoActions.loadRubrosEvento());
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(EventoPage);  