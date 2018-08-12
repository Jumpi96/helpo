import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'
import { connect } from 'redux'
import PropTypes from 'prop-types'
import * as actions from '../../../actions/misColaboracionesActions'

const propTypes = {
  misColaboraciones: PropTypes.object.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired
}

const ConsultarColaboracionConnected  = ( misColaboraciones, hasLoaded, hasError, fetchData ) => {

    return (
      <Card>
        <CardHeader>
            <i className="fa fa-align-justify"></i> <p>Colaboraciones del evento {this.props.evento}</p>
        </CardHeader>
        <CardBody>
          <TablaColaboraciones {...misColaboraciones.necesidades}/>
        </CardBody>
      </Card>
    );
  }
ConsultarColaboracionConnected.PropTypes = propTypes

const mapStateToProps = state => {
  return { 
    necesidades: state.misColaboraciones.misColaboracionesData,
    hasLoaded: state.misColaboraciones.misColaboracionesLoaded,
    hasError: state.misColaboraciones.misColaboracionesHasError
   }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },
  }
}

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;