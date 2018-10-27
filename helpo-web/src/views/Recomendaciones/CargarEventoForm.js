import React from 'react'
import { Form, Label, Input, Button } from 'reactstrap'
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion'
import TablaRecursos from './TablaRecursos'
import api from '../../api'

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
      // 
      rubros: [],
      recursos: [],
      funciones: [],
      errors: null //{}
    }
  }

  componentDidMount() {
    // Get rubros
    api.get('/actividades/rubros_evento/')
    .then(response => {
      this.setState({rubros: response.data})
    })
    .catch(error => this.setState({errors: error}))

    // Get categorias recurso
    api.get('/actividades/categorias_recurso/')
    .then(response => {
      this.setState({recursos: response.data})
    })
    .catch(error => this.setState({errors: error}))

    // Get categorias funciones
    api.get('/actividades/funciones/')
    .then(response => {
      this.setState({funciones: response.data})
    })
    .catch(error => this.setState({errors: error}))
  }

  handleUbicacionChange = (ubi) => {
    this.setState({ ubicacion: ubi });
  }

  handleRecursoChange = selected_recursos => this.setState({selected_recursos: selected_recursos})

  handleVoluntarioChange = selected_voluntarios => this.setState({selected_voluntarios: selected_voluntarios})

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
        {this.selectorRubros(this.state.rubros)}
        {this.esCampañaCheckbox()}
        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}
        />
        {/*Tabla Recursos*/}
        <TablaRecursos 
          categorias_recursos={this.state.recursos}
          selected_recursos={this.state.selected_recursos}
          onRecursoChange={this.handleRecursoChange}
          isRecursos={true}
          />
        {/*Tabla Funciones*/}
        <TablaRecursos 
          categorias_recursos={this.state.funciones}
          selected_recursos={this.state.selected_voluntarios}
          onRecursoChange={this.handleVoluntarioChange}
          isRecursos={false}
          />
        <Button color='primary'>Planificar</Button>
      </Form>
      </div>
      
    )
  }
}

export default CargarEventoForm