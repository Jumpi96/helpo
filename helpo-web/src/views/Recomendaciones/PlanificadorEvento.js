import React from 'react'
import { Card, CardHeader, CardBody, Col, Row, Container } from 'reactstrap'
import CargarEventoForm from './CargarEventoForm'
import PanelRecomendacion from './PanelRecomendacion'

class PlanificadorEvento extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      recomendaciones: {}
    }
  }

  onRecomendacionesChange = recomendaciones => this.setState({recomendaciones: recomendaciones})

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Complete los datos de la actividad a planificar
        </CardHeader>
        <CardBody>
          <Container>
            <Row>

              <Col>
                <CargarEventoForm onRecomendacionesChange={this.onRecomendacionesChange}/>
              </Col>

              <Col>
                <PanelRecomendacion recomendaciones={this.state.recomendaciones}/>
              </Col>

            </Row>
          </Container>
        </CardBody>
      </Card>
    )
  }
}

export default PlanificadorEvento