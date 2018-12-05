import React from 'react'
import { Button } from 'reactstrap'

class BotonCargando extends React.Component {
  
  render() {
    return  (
      <Button style={{ height: 35, width: 160 }}>
        <div className="loader"/>
      </Button>
    )
  }
}

export default BotonCargando