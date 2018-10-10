import React from 'react'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import SuscripcionesRedux from '../../../Redux/SuscripcionesRedux'
import ModalDesubscribir from './ModalDesubscribir'

/*
Boton para iniciar el borrado de una suscripcion
props:
  suscripcion
*/

class BotonDesubscribir extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {
    const modalOpen = this.state.modalOpen
    this.setState({
      modalOpen: !modalOpen
    })
  }

  render() {
    return (
      // Esto es para no tener q encerrar en una View
      <React.Fragment>
        <Button
          danger
          onPress={this.toggleModal}>
          <Text>Cancelar Suscripción</Text>
        </Button>
        <ModalDesubscribir 
          open={this.state.modalOpen} 
          toggle={this.toggleModal} 
          deleteSuscripcion={() => this.props.deleteSuscripcion(this.props.suscripcion)}/>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  deleteSuscripcion: suscripcion => dispatch(SuscripcionesRedux.suscripcionesDelete(suscripcion))
})

export default connect(null, mapDispatchToProps)(BotonDesubscribir)