import React from 'react';
import { PropTypes } from 'prop-types';
import { Route } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';
import * as eventoActions from '../../../actions/eventoActions';
import * as rubrosEventoActions from '../../../actions/rubroEventoActions';
import EventoList from './EventoList';
import EventoView from './EventoView';
import ButtonsCompartirOrganizacion from '../../common/ButtonsCompartir/ButtonsCompartirOrganizacion';

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventosOrganizacion();
  }

  getONG() {
    return this.props.auth.user;
  }

  render() {
    const eventos = this.props.eventos;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Mis actividades sociales
          </CardHeader>
          <CardBody>
            <div className="row">
              <div className="col-md-3">
                <EventoList eventos={eventos} />
              </div>
              <div className="col-md-9">
                <Route path={`${this.props.match.url}/:id`} component={EventoView} />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="row">
              <div className="form-group">
                <b name="compartir" className="float-left">Compartir</b>
              </div>
              <div className="form-group">
                <div className="float-left offset-md-3">
                  <ButtonsCompartirOrganizacion ong={this.getONG()} />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

EventoPage.propTypes = {
  eventos: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos,
    rubrosEvento: state.rubrosEvento,
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadEventosOrganizacion: () => {
      return dispatch(eventoActions.loadEventosOrganizacion());
    },
    loadRubrosEvento: () => {
      return dispatch(rubrosEventoActions.loadRubrosEvento());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventoPage);  