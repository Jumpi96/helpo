import React from 'react'
import { Card, CardHeader, CardBody, Form, Label, Input, FormGroup, Col, Row, Container } from 'reactstrap'
import CargarEventoForm from './CargarEventoForm'
import PanelRecomendacion from './PanelRecomendacion'

class PlanificadorEvento extends React.Component {

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Planificación de eventos
        </CardHeader>
        <CardBody>
          <Container>
            <Row>

              <Col>
                <CargarEventoForm/>
              </Col>

              <Col>
                <PanelRecomendacion/>
              </Col>

            </Row>
          </Container>
        </CardBody>
      </Card>
    )
  }
}

export default PlanificadorEvento