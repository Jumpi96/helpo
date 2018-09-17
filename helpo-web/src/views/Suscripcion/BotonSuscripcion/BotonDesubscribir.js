import React from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../../../actions/suscripcionesActions'

class BotonDesubscribir extends React.Component {
  
  render() {
    return  (
      <Button 
        color='danger' 
        style={{ height: 35, width: 160 }}
        onClick={() => this.props.deleteSuscripcion(this.props.suscripcion)}>
        <p bold >Cancelar Subscripcion</p>
      </Button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  deleteSuscripcion: suscripcion => dispatch(actions.deleteSuscripcion(suscripcion))
})

export default connect(null, mapDispatchToProps)(BotonDesubscribir)