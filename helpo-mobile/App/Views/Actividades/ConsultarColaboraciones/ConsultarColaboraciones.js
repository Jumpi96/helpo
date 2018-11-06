import React from 'react'
import SeccionRecurso from './ListaColaboraciones/SeccionRecurso'
import SeccionFuncion from './ListaVoluntarios/SeccionFuncion'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import { Container, Content, Form } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import ConsultarColabsActions from '../../../Redux/ConsultarColabsRedux'
import api from '../../../api'
import axios from 'axios'


class ConsultarColaboracionConnected extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { eventoId } = params;
    this.state = {
      modalOpen: false,
      eventoId
    }
    this.submitChanges = this.submitChanges.bind(this);
  }

  componentDidMount() {
    this.props.fetchData(this.state.eventoId)
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
        this.props.sentDataSuccess(true)
      })
      .catch(() => {
        this.props.sentDataHadError()
      })
    //Para que no se quede trabado el modal
    if (promises.length === 0) { this.props.sentDataSuccess(true) }
  }

  render() {

    const hasLoaded = () => {
      //This is true when data is null or undefined
      if (this.props.data) { return true }
      else { return false }
    }

    const content = () => {
      return (
        <Content>
          <Form>
            <SeccionRecurso necesidades={this.props.data.necesidades} navigation={this.props.navigation} />
          </Form>
          <Form>
            <SeccionFuncion voluntarios={this.props.data.voluntarios} navigation={this.props.navigation} />
          </Form>
        </Content>
      )
    }

    return (
      <Container>
        <ContainerHeader titulo='Consultar colaboraciones' goBack={this.props.navigation.goBack} />
        {hasLoaded()
          ? content()
          : <Text>Cargando...</Text>}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.consultarColabs.data,
    hasError: state.consultarColabs.error,
    entregados: state.consultarColabs.entregados,
    participaciones: state.consultarColabs.participaciones,
    sentSuccess: state.consultarColabs.sentDataSuccess,
    sentError: state.consultarColabs.sentDataHadError
  }
}

const mapDispatchToProps = dispatch => ({
  fetchData: eventoId => dispatch(ConsultarColabsActions.consultarColabsRequest(eventoId)),
  /*sentDataSuccess: (bool) => { dispatch(ConsultarColaboracionesActions.consultarColaboracionesSendDataSuccessful(bool)) },
  sentDataHadError: () => { dispatch(ConsultarColaboracionesActions.consultarColaboracionesSendDataHadError(true))}*/
})

const ConsultarColaboracion = connect(mapStateToProps, mapDispatchToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;