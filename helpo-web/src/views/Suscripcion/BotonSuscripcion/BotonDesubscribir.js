import React from 'react'
import { Button } from 'reactstrap'

class BotonDesubscribir extends React.Component {
  
  render() {
    return  (
      <Button color='danger' style={{ height: 35, width: 160 }}>
        <p bold >Cancelar Subscripcion</p>
      </Button>
    )
  }
}

export default BotonDesubscribir