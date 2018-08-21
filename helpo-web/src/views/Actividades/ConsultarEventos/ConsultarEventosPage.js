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
  renderEventos(){
    const eventos = this.props.eventos;
    if(eventos.length === 0){
      return(
        <div className="row">
          <div className="form-group col-md-6 col-md-offset-3">
            <label>&emsp;Todav&iacute;a no hay eventos registrados</label>
          </div>
        </div>
      )
    }
    else{
      return(
        <CardBody>
            <ConsultarEventosList eventos={eventos} auth={this.getAuth()} />
        </CardBody>
      )
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Consultar eventos
          </CardHeader>
          {this.renderEventos()}
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
