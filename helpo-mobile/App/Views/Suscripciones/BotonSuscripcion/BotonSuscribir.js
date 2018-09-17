import React from 'react'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import SuscripcionesRedux from '../../../Redux/SuscripcionesRedux'

/*
Boton para crear una suscripcion a una ONG (Funciona para cualquier usuario)
props:
  usuario(id)
  organizacion(id)
*/

class BotonSubscribir extends React.Component {

  render() {
    const { usuario, organizacion } = this.props

    return (
      <Button
        primary        
        onPress={() => this.props.createSuscripcion(usuario, organizacion)}>
        <Text>Subscribirse</Text>
      </Button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createSuscripcion: (usuario, organizacion) =>
    dispatch(SuscripcionesRedux.suscripcionesCreate(usuario, organizacion))
})

export default connect(null, mapDispatchToProps)(BotonSubscribir)