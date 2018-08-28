import React from 'react'
import SeccionRecurso from './ListaColaboraciones/SeccionRecurso'
import ListaVoluntarios from './ListaVoluntarios/ListaVoluntarios'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { Container, List } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import ConsultarColabsActions, { ConsultarColabsTypes } from '../../../Redux/ConsultarColabsRedux'
import api from '../../../api'
import axios from 'axios'


class ConsultarColaboracionConnected extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    }
    this.submitChanges = this.submitChanges.bind(this);
  }

  componentDidMount() {
    const eventoId = this.props.navigation.state.params.eventoId
    this.props.fetchData(eventoId)
  }   

  submitChanges() {
    this.props.sentDataSuccess(false)
    this.toggleModal(true)
    let promises = []
    for ( let key in this.props.entregados ) {
      const patchData = { entregado: this.props.entregados[key] }
      const promise = api.patch(`/actividades/colaboraciones/${key}/`, patchData)
      promises.push(promise)
    }
    for ( let key in this.props.participaciones ) {
      const patchData = { participo: this.props.participaciones[key] }
      const promise = api.patch(`/actividades/participaciones/${key}/`, patchData)
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

    const hasLoaded = () => {
      //This is true when data is null or undefined
      if (this.props.data) { return true }
      else { return false }
    }

    const content = () => { return (
      <View>
        <SeccionRecurso necesidades={this.props.data.necesidades}/>
      </View>
    )}

    return (
      <Container>
        <ContainerHeader titulo='Consultar Colaboracion' goBack={this.props.navigation.goBack}/>
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