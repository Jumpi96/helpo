import React from 'react'
import BotonCargando from './BotonCargando'
import BotonSubscribir from './BotonSubscribir'
import BotonDesubscribir from './BotonDesubscribir'
import * as actions from '../../../actions/suscripcionesActions'
import { connect } from 'react-redux'


/*
Componente que hace todo el manejo de  la suscripcion/desuscripcion.
USAR ESTE

Props:
  organizacion (id)
*/
class BotonSuscripcion extends React.Component {

  componentDidMount() {
    this.props.fetchSuscripciones(this.props.usuario)
  }

  getSuscripcion(userId, ongId) {
    /*Devuelve la suscripcion del userId a ongId o null,
    dependiendo si existe o no en las suscripciones cargados
    en el state  */
    const suscripciones = this.props.suscripciones 
    for (var suscripcion of suscripciones) {
      const usuario = suscripcion.usuario.id
      const ong = suscripcion.organizacion.id
      if (usuario === userId && ong === ongId) {
        return suscripcion
      }
    }
    return null
  }

  isSubscribed() {
    // True si suscrito - False si no suscrito
    if (this.getSuscripcion(this.props.usuario, this.props.organizacion) === null) {
      return false
    }
    return true
  }

  render() {    
    const { usuario, organizacion } = this.props
    const suscripcion = this.getSuscripcion(usuario, organizacion)
    let boton = <BotonCargando />

    if (this.props.loading) {
      boton = <BotonCargando />
    }    
    else if (this.isSubscribed() === true) {
      boton = <BotonDesubscribir        
        suscripcion={suscripcion}
      />
    }
    else {
      boton = <BotonSubscribir
        usuario={usuario}
        organizacion={organizacion}
      />
    }
    return boton
  }
}

const mapStateToProps = state => ({
  suscripciones: state.suscripciones.items,
  usuario: state.auth.user.id,
  loading: state.suscripciones.loading
})

const mapDispatchToProps = dispatch => ({
  fetchSuscripciones: userId => dispatch(actions.fetchSuscripciones(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(BotonSuscripcion)