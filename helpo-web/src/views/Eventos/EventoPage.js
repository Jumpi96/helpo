import React from 'react';  
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';  
import * as eventoActions from '../../actions/eventoActions';
import EventoList from './EventoList';

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadEventos();
  }

  render() {
    return (
        <div className="col-md-12">
          <h1>Eventos</h1>
          <div className="col-md-4">
            <EventoList eventos={this.props.eventos} />
          </div>
        </div>
    )
  }
}

EventoPage.propTypes = {
  eventos: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos
  }
} 

const mapDispatchToProps = dispatch => {
    return {
      loadEventos: () => {
        return dispatch(eventoActions.loadEventos());
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(EventoPage);  