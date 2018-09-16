import React from 'react'
import BotonCargando from './BotonCargando'
import BotonSubscribir from './BotonSubscribir'
import BotonDesubscribir from './BotonDesubscribir'

class BotonSuscripcion extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      suscripto: null
    }
  }

  componentDidMount() {
    
  }

  render() {

    let boton = <BotonCargando/>

    if (this.state.suscripto === null) {
      boton = <BotonCargando/>
    }
    else if (this.state.suscripto === true) {
      boton = <BotonDesubscribir/>
    }
    else { boton = <BotonSubscribir/> }

    return boton
  }
}

export default BotonSuscripcion