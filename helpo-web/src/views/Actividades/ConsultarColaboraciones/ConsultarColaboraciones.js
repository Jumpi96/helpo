import React from 'react'
import { Card, CardHeader, CardBody, Button } from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'
import TablaVoluntarios from './TablaVoluntarios/TablaVoluntarios'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../../actions/consultarColaboracionesActions'
import api from '../../../api'

const propTypes = {
  necesidades: PropTypes.object.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  participaciones: PropTypes.object.isRequired,
  entregados: PropTypes.object.isRequired
}

class ConsultarColaboracionConnected extends React.Component {
  
  constructor(props) {
    super(props);
    this.submitChanges = this.submitChanges.bind(this);
  }

  componentDidMount() {
    this.props.fetchData(this.props.match.params.eventoId)
  } 

  submitChanges() {
    let promises = []
    for ( let key in this.props.entregados ) {
      const patchData = { entregado: this.props.entregados[key] }
      const promise = api.patch(`/actividades/colaboraciones/${key}/`, patchData)
      promises.push(promise)
    }
    for ( let key in this.props.participaciones ) {
      const patchData = { participo: this.props.entregados[key] }
      const promise = api.patch(`/actividades/participaciones/${key}/`, patchData)
      promises.push(promise)
    }
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
          <Button color='primary' onClick={this.submitChanges}>
            Guardar cambios
          </Button>
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
    hasError: state.consultarColaboraciones.consultarColaboracionesHasError,
    entregados: state.consultarColaboraciones.entregados,
    participaciones: state.consultarColaboraciones.participaciones
   }
}

const mapDispatchToProps = dispatch => ({
   fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },  
})

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;