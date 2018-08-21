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

  getAuth() {
    return this.props.auth.isAuthenticated;
  }

  render() {
    const eventos = this.props.eventos;
    if (eventos[0] && eventos[0].descripcion) {
      return (
        <div className="animated fadeIn">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Consultar eventos
            </CardHeader>
            <CardBody>
              <ConsultarEventosList eventos={eventos} auth={this.getAuth()} />
            </CardBody>
          </Card>
        </div>
      );
    } else {
      return <p>Cargando...</p>
    }
  }
}

ConsultarEventosPage.propTypes = {
  eventos: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    eventos: state.eventos,
    auth: state.auth, 
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
