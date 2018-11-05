import React from 'react'
import { Form, Label, Input, Button } from 'reactstrap'
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion'
import TablaRecursos from './TablaRecursos'
import api from '../../api'

class CargarEventoForm extends React.Component {
  /*
  Form where the data of the event that you are planning is registered
  props:
    rubros: [{id: 1, nombre: ""},...]
    recursos: [{id, categoria, nombre},]
    funciones: [{id, nombre}]

    onRecomendacionesChange: fn(recomendaciones)
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
        this.setState({ rubros: response.data })
      })
      .catch(error => this.setState({ errors: error }))

    // Get categorias recurso
    api.get('/actividades/categorias_recurso/')
      .then(response => {
        this.setState({ recursos: response.data })
      })
      .catch(error => this.setState({ errors: error }))

    // Get categorias funciones
    api.get('/actividades/funciones/')
      .then(response => {
        this.setState({ funciones: response.data })
      })
      .catch(error => this.setState({ errors: error }))
  }

  handleUbicacionChange = (ubi) => {
    this.setState({ ubicacion: ubi });
  }

  handleRecursoChange = selected_recursos => this.setState({ selected_recursos: selected_recursos })

  handleVoluntarioChange = selected_voluntarios => this.setState({ selected_voluntarios: selected_voluntarios })

  handleRubroSelect = event => this.setState({ selected_rubro: parseInt(event.target.value, 10) })

  handleCampañaChange = event => this.setState({ is_campaña: event.target.checked })

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
        Rubro
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
      <Label style={{ marginTop: 15, marginBottom: 15 }} check>
        ¿Es una campaña?
        <Input onChange={this.handleCampañaChange} style={{ marginLeft: 8 }} type="checkbox" />
      </Label>
    )
  }

  recursosObjectToArray() {
    // Transforms this.state.selected_recursos into an array, ready to be sent
    let selected_recursos = []
    for(const recurso in this.state.selected_recursos) {
      selected_recursos.push(parseInt(recurso, 10))
    }
    return selected_recursos
  }

  voluntariosObjectToArray() {
    // Transforms this.state.selected_voluntarios into an array, ready to be sent
    let selected_voluntarios = []
    for(const recurso in this.state.selected_voluntarios) {
      selected_voluntarios.push(parseInt(recurso, 10))
    }
    return selected_voluntarios
  }

  submitDatosEvento = () => {
    const evento_data = {
      rubro_actividad: this.state.selected_rubro,
      campaña: this.state.is_campaña,
      ubicacion: {
        latitud: this.state.ubicacion.latitud,
        longitud: this.state.ubicacion.longitud
      },
      categorias_recurso: this.recursosObjectToArray(),
      funciones: this.voluntariosObjectToArray()
    }
    this.props.onRecomendacionesChange('Loading...')
    api.post('/recommendations/predict_fechas/', evento_data)
    .then(response => {
      this.props.onRecomendacionesChange(response.data)
    })
    .catch(error => this.setState({errors: error}))
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
        <Form style={{ margin: 10 }}>
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
          <Button color='primary' onClick={this.submitDatosEvento}>Planificar</Button>
        </Form>
      </div>

    )
  }
}

export default CargarEventoForm