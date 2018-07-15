import React from 'react';  
import { PropTypes } from 'prop-types'; 
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';  
import * as eventoActions from '../../../actions/eventoActions';
import ConsultarEventosList from './ConsultarEventosList';

class ConsultarEventosPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadEventosProximos();
  }

  render() {
    const eventos = this.props.eventos;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Consultar eventos
          </CardHeader>
          <CardBody>
            <ConsultarEventosList eventos={eventos} />
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
      loadEventosProximos: () => {
        return dispatch(eventoActions.loadEventosProximos());
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarEventosPage);
