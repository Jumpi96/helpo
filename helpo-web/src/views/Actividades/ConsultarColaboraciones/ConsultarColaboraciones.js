import React from 'react'
import { Card, CardHeader, CardBody, Button, Modal, ModalBody } from 'reactstrap'
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
    const urlParams = new URLSearchParams(this.props.location.search)
    const evento = urlParams.get('evento');
    this.state = {
      modalOpen: false,
      evento
    }
    this.submitChanges = this.submitChanges.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  componentDidMount() {
    this.props.fetchData(this.state.evento)
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
      if (this.props.sentError) {
        return <p>Hubo un problema al querer guardar los datos, intentelo mas tarde</p>
      }
      else if (this.props.sentSuccess) {
        return <p>Se guardaron los datos con exito</p>
      }
      else {
        return <p> Aguarde unos segundos... </p>
      }
    }
    return (
      <Modal style={{ allignItems: 'center', justifyContent: 'center' }} isOpen={this.state.modalOpen}>
        <ModalBody>
          {info()}
          <Button onClick={() => this.toggleModal(false)} >Aceptar</Button>
        </ModalBody>
      </Modal>
    )
  }

  validatePdfRequirments() {
    // Checks if there is data about necesidades and voluntarios (already fetched and not empty)
    let is_valid = false
    if (typeof this.props.necesidades === 'undefined' || typeof this.props.necesidades.necesidades === 'undefined' || typeof this.props.necesidades.voluntarios === 'undefined') {
      return is_valid
    }
    if (this.colaboracionExists()) {
      is_valid = true
    }
    return is_valid
  }

  colaboracionExists() {
    // Checks that at least one colaboracion or participacion exists
    if (!this.props.necesidades) {
      // Pre-check that the necesidades props exists 
      return false
    }

    // Existen necesidades
    if (this.props.necesidades.necesidades) {
      for (const necesidad of this.props.necesidades.necesidades) {
        const { colaboraciones } = necesidad

        if (colaboraciones.length > 0) {
          return true
        } 
      }
    }
    // Existen necesidades de voluntarios
    if (this.props.necesidades.voluntarios) {
      for (const voluntario of this.props.necesidades.voluntarios) {
        const { participaciones } = voluntario

        if (participaciones.length > 0) {
          return true
        } 
      }
    }
  }

  submitChanges() {
    this.props.sentDataSuccess(false)
    this.toggleModal(true)
    let promises = []
    for (let key in this.props.entregados) {
      const patchData = { entregado: this.props.entregados[key], colaboracion: key }
      const promise = api.post(`/feedbacks/entregados/`, patchData)
      promises.push(promise)
    }
    for (let key in this.props.participaciones) {
      const patchData = { participo: this.props.participaciones[key], participacion: key };
      const promise = api.post(`/feedbacks/participados/`, patchData)
      promises.push(promise)
    }
    axios.all(promises)
      .then(() => {
        this.props.fetchData(this.state.evento);
        this.props.sentDataSuccess(true)
      })
      .catch(() => {
        this.props.sentDataHadError()
      })
    //Para que no se quede trabado el modal
    if (promises.length === 0) { this.props.sentDataSuccess(true) }
  }

  render() {
    let descargar_pdf = null
    if (this.validatePdfRequirments()) {
      descargar_pdf = (
        <Button style={{ marginLeft: 10 }} color='primary' className='col-' onClick={this.downloadPDF}>
          Descargar como PDF
        </Button>
      )
    }

    const content = () => {
      return (
        <div>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Colaboraciones del evento {this.props.necesidades.nombre}
          </CardHeader>
          <CardBody>
            <TablaColaboraciones keys={this.props.necesidades.necesidades} submitChanges={this.submitChanges} />
            <TablaVoluntarios keys={this.props.necesidades.voluntarios} submitChanges={this.submitChanges} />
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
      )
    }

    return (
      <Card>
        {this.props.hasLoaded
          ? content()
          : <div className="loader"/>}
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
  sentDataHadError: () => { dispatch(actions.consultarColaboracionesSendDataHadError(true)) }
})

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;