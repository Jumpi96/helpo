import React from 'react';  
import { PropTypes } from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';  
import * as eventoActions from '../../actions/eventoActions';
import * as rubrosEventoActions from '../../actions/rubroEventoActions';
import EventoList from './EventoList';
import EventoView from './EventoView';

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventos();
  }

  render() {
    const eventos = this.props.eventos;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Mis eventos
          </CardHeader>
          <CardBody>
            <div className="col-md-12">
              <h1><Link to={'/actividades/registrar-evento'} className="btn btn-primary">+ Nuevo evento</Link></h1>
              <div className="col-md-4">
                <EventoList eventos={eventos} />
              </div>
              <div className="col-md-8">
                <Route path={`${this.props.match.url}/:id`} component={EventoView}/>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
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