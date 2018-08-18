import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'
import TablaVoluntarios from './TablaVoluntarios/TablaVoluntarios'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../../actions/consultarColaboracionesActions'

const propTypes = {
  necesidades: PropTypes.object.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired
}

class ConsultarColaboracionConnected extends React.Component {
  
  componentDidMount() {
    this.props.fetchData(this.props.match.params.eventoId)
  } 

  render() {
    console.log(this.props)
    const content = () => { return (
      <div>
      <CardHeader>
            <i className="fa fa-align-justify"></i> Colaboraciones del evento {this.props.necesidades.nombre}
      </CardHeader>
      <CardBody>
          <TablaColaboraciones {...this.props.necesidades.necesidades}/>
          <TablaVoluntarios {...this.props.necesidades.voluntarios}/>
      </CardBody>
      </div>
    )}

    return (
      <Card>
        {this.props.hasLoaded 
        ? content()
        : <p>Cargando...</p>}        
      </Card>
    );
  }
}
ConsultarColaboracionConnected.propTypes = propTypes

const mapStateToProps = state => {
  return { 
    necesidades: state.consultarColaboraciones.consultarColaboracionesData,
    hasLoaded: state.consultarColaboraciones.consultarColaboracionesLoaded,
    hasError: state.consultarColaboraciones.consultarColaboracionesHasError
   }
}

const mapDispatchToProps = dispatch => ({
   fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },  
})

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;