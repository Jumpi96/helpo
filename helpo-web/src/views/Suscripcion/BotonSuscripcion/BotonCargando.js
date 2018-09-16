import React from 'react'
import { Button } from 'reactstrap'

class BotonCargando extends React.Component {
  
  render() {
    return  (
      <Button style={{ height: 35, width: 160 }}>
        <p bold >Cargando...</p>
      </Button>
    )
  }
}

export default BotonCargando