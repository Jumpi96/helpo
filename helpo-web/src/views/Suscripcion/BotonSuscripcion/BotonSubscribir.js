import React from 'react'
import { Button } from 'reactstrap'

class BotonSubscribir extends React.Component {
  
  render() {
    return  (
      <Button color='primary' style={{ height: 35, width: 160 }}>
        <p bold >Subscribirse a ONG</p>
      </Button>
    )
  }
}

export default BotonSubscribir