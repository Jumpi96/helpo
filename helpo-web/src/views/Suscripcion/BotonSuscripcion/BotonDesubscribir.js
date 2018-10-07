import React from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../../../actions/suscripcionesActions'
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
      <div>
        <Button
          color='danger'
          style={{ height: 35, width: 160 }}
          onClick={this.toggleModal}>
          <p>Cancelar Suscripción</p>
        </Button>
        <ModalDesubscribir 
          open={this.state.modalOpen} 
          toggle={this.toggleModal} 
          deleteSuscripcion={() => this.props.deleteSuscripcion(this.props.suscripcion)}/>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  deleteSuscripcion: suscripcion => dispatch(actions.deleteSuscripcion(suscripcion))
})

export default connect(null, mapDispatchToProps)(BotonDesubscribir)