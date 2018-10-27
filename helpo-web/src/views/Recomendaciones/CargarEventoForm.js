import React from 'react'
import { Card, CardHeader, CardBody, Form, Label, Input, FormGroup, Col, Row, Container } from 'reactstrap'
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion'

const test_rubros = [
  { id: 1, nombre: 'Actividad' },
  { id: 2, nombre: 'Social' },
  { id: 3, nombre: 'Cultural' },
  { id: 4, nombre: 'Cientifico' }
]

class CargarEventoForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
    }
  }

  handleUbicacionChange = (ubi) => {
    this.setState({ ubicacion: ubi });
  }

  selectorRubros = (rubros) => {
    //rubros = [{id: 1, nombre: ""},...]
    let array_rubros = rubros

    // Guard against rubros == undefined
    if (!rubros) { array_rubros = [] }

    const rubros_options = array_rubros.map(rubro => (
      <option key={rubro.id} value={rubro.id}>{rubro.nombre}</option>
    ))

    return (
      <Label for="selectRubro" style={{ width: '100%' }}>
        Rubro:
        <Input type="select" name="selectRubro" id="selectRubro">
          {rubros_options}
        </Input>
      </Label>
    )
  }

  esCampañaCheckbox = () => {
    return (
      <Label style={{marginTop: 15, marginBottom: 15}} check>
        Es campaña?
        <Input style={{ marginLeft: 8 }} type="checkbox" />
      </Label>
    )
  }

  render() {
    return (
      <Form>
        {this.selectorRubros(test_rubros)}
        {this.esCampañaCheckbox()}
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}
        />
      </Form>
    )
  }
}

export default CargarEventoForm