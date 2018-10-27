import React from 'react'
import { Card, CardHeader, CardBody, Form, Label, Input, FormGroup, Col, Row, Container, Button } from 'reactstrap'
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion'
import TablaRecursos from './TablaRecursos'
import TablaVoluntarios from './TablaVoluntarios'

const test_rubros = [
  { id: 1, nombre: 'Actividad' },
  { id: 2, nombre: 'Social' },
  { id: 3, nombre: 'Cultural' },
  { id: 4, nombre: 'Cientifico' }
]

class CargarEventoForm extends React.Component {
  /*
  Form where the data of the event that you are planning is registered
  props:
    rubros: [{id: 1, nombre: ""},...]
    recursos: [{id, categoria, nombre},]
    funciones: [{id, nombre}]

    onSubmit: ()
  */

  constructor(props) {
    super(props)
    this.state = {
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      selected_rubro: 1,
      selected_recursos: {},
      selected_voluntarios: {},
      is_campaña: false,
      errors: null //{}
    }
  }

  handleUbicacionChange = (ubi) => {
    this.setState({ ubicacion: ubi });
  }

  handleRubroSelect = event => this.setState({selected_rubro: parseInt(event.target.value, 10)})

  handleCampañaChange = event => this.setState({is_campaña: event.target.checked})

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
        <Input 
          type="select"
          name="selectRubro" 
          id="selectRubro"
          value={this.state.selected_rubro}
          onChange={this.handleRubroSelect}
          >        
          {rubros_options}
        </Input>
      </Label>
    )
  }

  esCampañaCheckbox = () => {
    return (
      <Label style={{marginTop: 15, marginBottom: 15}} check>
        Es campaña?
        <Input onChange={this.handleCampañaChange} style={{ marginLeft: 8 }} type="checkbox" />
      </Label>
    )
  }

  render() {
    return (
      <div style={{
        border: '2px solid',
        borderColor: '#d7d7d7',
        borderRadius: '5px' 
        }}>
        <p style={{
          fontWeight: 'bold',
          fontSize: 14,
          display: 'block',
          backgroundColor: '#d7d7d7',
          padding: 10
        }}>
        Planificación
        </p>
        <Form style={{margin: 10}}>
        {this.selectorRubros(test_rubros)}
        {this.esCampañaCheckbox()}
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}
        />
        <TablaRecursos categorias_recursos={test_rubros}/>
        <TablaVoluntarios/>
        <Button color='primary'>Planificar</Button>
      </Form>
      </div>
      
    )
  }
}

export default CargarEventoForm