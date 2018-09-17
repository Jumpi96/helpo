import React from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../../../actions/suscripcionesActions'

class BotonSubscribir extends React.Component {

  render() {
    const { usuario, organizacion } = this.props

    return (
      <Button
        color='primary'
        style={{ height: 35, width: 160 }}
        onClick={() => this.props.createSuscripcion(usuario, organizacion)}>
        <p bold >Subscribirse a ONG</p>
      </Button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createSuscripcion: (usuario, organizacion) =>
    dispatch(actions.createSuscripcion(usuario, organizacion))
})

export default connect(null, mapDispatchToProps)(BotonSubscribir)