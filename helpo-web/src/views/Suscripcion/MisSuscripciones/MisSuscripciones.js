import React from 'react'
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'reactstrap'
import { connect } from 'react-redux'
import BotonSuscripcion from '../BotonSuscripcion/BotonSuscripcion'
import BotonPerfil from '../../../utils/BotonPerfil'
import * as actions from '../../../actions/suscripcionesActions'

class MisSuscripciones extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      suscripciones: this.props.suscripciones,
      locked: false
    }
  }


  componentDidMount() {
    this.props.fetchSuscripciones(this.props.usuario)
  }

  renderFilas() {
    const { suscripciones } = this.state.locked ? this.state : this.props
    // Caso que no haya suscripciones
    if (suscripciones.length === 0) {
      return <p> No tienes ninguna suscripcion </p>
    }
    /*
    Locked es para que si se desubscribe la organizacion siga en la lista
    hasta que se refresque la pagina
    */
    if (!this.state.locked) {
      this.setState({
        suscripciones: suscripciones,
        locked: true
      })
    }
    const filas = suscripciones.map(suscripcion => {
      return (
        <ListGroupItem
          style={{ display: 'flex', justifyContent: 'space-between' }}
          key={suscripcion.organizacion.id}>
          <p
            className="font-weight-bold"
            style={{ fontSize: 16 }}>{suscripcion.organizacion.nombre}</p>
          <div style={{ display: 'inline-block' }}>
            <div style={{ display: 'inline-block' }}>
              <BotonPerfil id={suscripcion.organizacion.id} />
            </div>
            <div style={{ display: 'inline-block', marginLeft: 10 }}>
              <BotonSuscripcion organizacion={suscripcion.organizacion.id} />
            </div>
          </div>
        </ListGroupItem>
      )
    })
    return filas
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i>Mis suscripciones
        </CardHeader>
        <CardBody>
          <h1 style={{ fontSize: 24 }}>Mis suscripciones</h1>
          <ListGroup>
            {this.renderFilas()}
          </ListGroup>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  suscripciones: state.suscripciones.items,
  usuario: state.auth.user.id
})

const mapDispatchToProps = dispatch => ({
  fetchSuscripciones: userId => dispatch(actions.fetchSuscripciones(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(MisSuscripciones)
