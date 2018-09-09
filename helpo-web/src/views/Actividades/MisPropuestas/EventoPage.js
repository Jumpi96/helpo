import React from 'react';  
import { PropTypes } from 'prop-types';
import { Route } from 'react-router-dom';
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';  
import * as eventoActions from '../../../actions/eventoActions';
import EventoList from './EventoList';
import EventoView from './EventoView';

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadEventosConColaboraciones();
  }

  render() {
    const eventos = this.props.eventos;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Mis propuestas
          </CardHeader>
          <CardBody>
            <div className="row">
              <div className="col-md-3">
                <EventoList eventos={eventos} />
              </div>
              <div className="col-md-9">
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
  eventos: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos,
  }
} 

const mapDispatchToProps = dispatch => {
    return {
      loadEventosConColaboraciones: () => {
        return dispatch(eventoActions.loadEventosConColaboraciones());
      },
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(EventoPage);  