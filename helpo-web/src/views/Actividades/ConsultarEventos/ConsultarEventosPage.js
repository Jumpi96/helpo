import React from 'react';  
import { PropTypes } from 'prop-types'; 
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';  
import * as eventoActions from '../../../actions/eventoActions';
import ConsultarEventosList from './ConsultarEventosList';

class ConsultarEventosPage extends React.Component {
  constructor(props) {
    super(props);
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
            <div className="row">
              <ConsultarEventosList eventos={eventos} />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

ConsultarEventosPage.propTypes = {
  eventos: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos, 
  }
} 

const mapDispatchToProps = dispatch => {
    return {
      loadEventos: () => {
        return dispatch(eventoActions.loadEventos());
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarEventosPage);  