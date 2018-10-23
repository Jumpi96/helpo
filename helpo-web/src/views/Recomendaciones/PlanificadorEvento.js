import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'

class PlanificadorEvento extends React.Component {

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Planificación de eventos
        </CardHeader>
        <CardBody>
          <h2>Planificador de eventos</h2>
        </CardBody>
      </Card>
    )
  }
}

export default PlanificadorEvento