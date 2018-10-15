import React from 'react';  
import { PropTypes } from 'prop-types';
import { Button } from 'reactstrap'
import { Route } from 'react-router-dom';
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';  
import * as eventoActions from '../../../actions/eventoActions';
import EventoList from './EventoList';
import EventoView from './EventoView';
import api from '../../../api'

class EventoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ** Usados para PDF
      propuestas: null,
      detalle_propuestas: null
      // **
    }
    this.props.loadEventosConColaboraciones();
  }

  componentDidMount() {
    const { empresa } = this.props

    api.get(`actividades/consulta_propuestas/${empresa}/`)
    .then( response => {
      this.setState({
        detalle_propuestas: response.data
      })
    })
    .catch( error => { console.log(error) })

    api.get(`actividades/empresa_propuestas/${empresa}/`)
    .then( response => {
      this.setState({
        propuestas: response.data
      })
    })
    .catch( error => { console.log(error) })
  }

  render() {
    const eventos = this.props.eventos;

    const BotonPDF = () => (
      <Button color='primary'>Descarga reporte PDF</Button>
    )

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
                <Route path={`${this.props.match.url}`} component={BotonPDF}/>
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
    empresa: state.auth.user.id
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