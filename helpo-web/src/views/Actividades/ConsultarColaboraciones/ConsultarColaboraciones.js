import React from 'react'
import { Card, CardHeader, CardBody, Button, Modal, ModalBody} from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'
import TablaVoluntarios from './TablaVoluntarios/TablaVoluntarios'
import downloadPDF from './downloadPDF'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../../actions/consultarColaboracionesActions'
import api from '../../../api'
import axios from 'axios'


const propTypes = {
  necesidades: PropTypes.object.isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  participaciones: PropTypes.object.isRequired,
  entregados: PropTypes.object.isRequired,
  sentDataHadError: PropTypes.func.isRequired,
  sentDataSuccess: PropTypes.func.isRequired,
  sentSuccess: PropTypes.bool.isRequired,
  sentError: PropTypes.bool.isRequired
}

class ConsultarColaboracionConnected extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    }
    this.submitChanges = this.submitChanges.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
    this.dataIsEmpty = this.dataIsEmpty.bind(this);
  }

  componentDidMount() {
    this.props.fetchData(this.props.match.params.eventoId)
  }

  downloadPDF() {
    const { necesidades, ong_nombre } = this.props
    downloadPDF(necesidades, ong_nombre)
  }

  toggleModal(bool) {
    this.setState({
      modalOpen: bool
    })
  }

  renderModal() {   
    const info = () => {
      if( this.props.sentError ) {
        return <p>Hubo un problema al querer guardar los datos, intentelo mas tarde</p>
      }
      else if( this.props.sentSuccess ) {
        return <p>Se guardaron los datos con exito</p>
      }
      else {
        return <p> Aguarde unos segundos... </p>
      }
    } 
    return (
      <Modal style={{ allignItems: 'center', justifyContent: 'center' }} isOpen={ this.state.modalOpen }>
      <ModalBody>
        {info()}
        <Button onClick={() => this.toggleModal(false)} >Volver</Button>
      </ModalBody>
      </Modal>
    )
  }

  dataIsEmpty() {
    // Checks if there is data about necesidades and voluntarios (already fetched and not empty)
    let is_empty = true
    if (typeof this.props.necesidades === 'undefined' || typeof this.props.necesidades.necesidades === 'undefined' || typeof this.props.necesidades.voluntarios === 'undefined') {
      return is_empty
    }
    if (this.props.necesidades.necesidades.length > 0 && this.props.necesidades.voluntarios.length > 0) {
      is_empty = false
    }
    return is_empty
  }

  submitChanges() {
    this.props.sentDataSuccess(false)
    this.toggleModal(true)
    let promises = []
    for ( let key in this.props.entregados ) {
      const patchData = { entregado: this.props.entregados[key], colaboracion: key }
      const promise = api.post(`/feedbacks/entregados/`, patchData)
      promises.push(promise)
    }
    for ( let key in this.props.participaciones ) {
      const patchData = { participo: this.props.participaciones[key], participacion: key };
      const promise = api.post(`/feedbacks/participados/`, patchData)
      promises.push(promise)
    }
    axios.all(promises)
    .then( () => {
      this.props.sentDataSuccess(true)
    })
    .catch( () => {
      this.props.sentDataHadError()
    } )
    //Para que no se quede trabado el modal
    if(promises.length === 0) { this.props.sentDataSuccess(true) }
  }

  render() {
    let descargar_pdf = null
    if (!this.dataIsEmpty()) {
      descargar_pdf = (
        <Button style={{marginLeft: 10}} color='primary' className='col-' onClick={this.downloadPDF}>
          Descargar como PDF
        </Button>
      )
    }

    console.log(this.dataIsEmpty())
    const content = () => { return (
      <div>
      <CardHeader>
            <i className="fa fa-align-justify"></i> Colaboraciones del evento {this.props.necesidades.nombre}
      </CardHeader>
      <CardBody>
          <TablaColaboraciones {...this.props.necesidades.necesidades}/>
          <TablaVoluntarios {...this.props.necesidades.voluntarios}/>
          <div className='container'>
            <div className='row'>
            <Button color='primary' className='col-' onClick={this.submitChanges}>
              Guardar cambios
            </Button>
            {/* Boton descargar PDF */}
            {descargar_pdf}            
            <div style={{ allignItems: 'center' }}>{this.renderModal()}</div>
            </div>
          </div>
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
    participaciones: state.consultarColaboraciones.participaciones,
    sentSuccess: state.consultarColaboraciones.sentDataSuccess,
    sentError: state.consultarColaboraciones.sentDataHadError,
    ong_nombre: state.auth.user.nombre
   }
}

const mapDispatchToProps = dispatch => ({
   fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },  
   sentDataSuccess: (bool) => { dispatch(actions.consultarColaboracionesSendDataSuccessful(bool)) },
   sentDataHadError: () => { dispatch(actions.consultarColaboracionesSendDataHadError(true))}
})

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;