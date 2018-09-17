import React from 'react'
import { connect } from 'react-redux'
import SuscripcionesRedux from '../../../Redux/SuscripcionesRedux'
import ContainerHeader from '../../../Components/ContainerHeader'
import { Container, Text } from 'native-base'
import { FlatList, View } from 'react-native'


class MisSuscripciones extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      suscripciones: this.props.suscripciones,
      locked: false
    }
    this.getSuscripciones = this.getSuscripciones.bind(this)
  }


  componentDidMount() {
    this.props.fetchSuscripciones(this.props.usuario)
  }

  getSuscripciones() {
    // Se encarga de manejar de donde se van a tomar las suscripciones (props o state)
    const { suscripciones } = this.state.locked ? this.state : this.props
    /*
    Locked es para que si se desubscribe la organizacion siga en la lista
    hasta que se refresque la pagina
    */
    // Este if es para asegurarme de no llamar setState innecesariamente
    if (suscripciones.length !== 0) {
      if (!this.state.locked) {
        this.setState({
          suscripciones: suscripciones,
          locked: true
        })
      }
    }
    return suscripciones
  }

  renderItem = (suscripcion) => {
    return (
      <View
        key={suscripcion.id}>
        <Text>{suscripcion.organizacion.nombre}</Text>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <ContainerHeader
          titulo="Mis Suscripciones"
          goBack={() => this.props.navigation.goBack()} />
        {/* Si hay suscripciones renderizo la lista, sino un texto */}
        {this.props.suscripciones.length === 0
          ? <Text>No tiene suscripciones</Text>
          : <FlatList
            data={this.getSuscripciones()}
            renderItem={({ item }) => this.renderItem(item)} />
        }
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  suscripciones: state.suscripciones.items,
  usuario: state.auth.user.id
})

const mapDispatchToProps = dispatch => ({
  fetchSuscripciones: userId => dispatch(SuscripcionesRedux.suscripcionesFetch(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(MisSuscripciones)
