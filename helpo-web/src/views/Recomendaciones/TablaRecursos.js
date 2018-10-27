import React from 'react'
import { Table, Button, Input } from 'reactstrap'

class TablaRecursos extends React.Component {
  /*
  Table for selecting recursos in PlanificadorEvento

  props:
    categorias_recursos: [{id, nombre}]
    is_recursos: boolean
  */

  constructor(props) {
    super(props)
    this.state = {
      selected_recursos: {}, // {id: nombre}
      selected_recurso: 1,
    }
  }

  handleSelectChange = (event) => this.setState({ selected_recurso: event.target.value })

  handleAgregarRecurso = () => {
    const recurso_selected_id = this.state.selected_recurso
    // Guard against null/undefined
    if (!recurso_selected_id) {
      return
    }
    // Search recurso in props.categorias_recursos and insert it in selected_recursos
    // (It should always exist, otherwise it would be impossible to be selected)
    for (const recurso of this.props.categorias_recursos) {
      if (String(recurso.id) === recurso_selected_id) {
        const selected_recursos = this.state.selected_recursos
        selected_recursos[recurso.id] = recurso.nombre
        this.setState({selected_recursos: selected_recursos})
        return
      }
    }
  }

  handleRemoveRecurso = recurso_id => {
    // Removes from selected_recursos, recurso with recurso_id
    const selected_recursos = this.state.selected_recursos
    delete selected_recursos[recurso_id]
    this.setState({ selected_recursos: selected_recursos })
  }

  selectorRecurso = () => {
    // Component to select a recurso 
    let categoria_recursos = this.props.categorias_recursos
    // Guard against undefined
    if (!categoria_recursos) {
      categoria_recursos = []
    }
    const selector_options = categoria_recursos.map(categoria => (
      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
    ))

    return (
      <Input
        type="select"
        name="selectRecurso"
        id="selectRecurso"
        value={this.state.selected_recurso}
        onChange={this.handleSelectChange}
      >
        {selector_options}
      </Input>
    )
  }

  renderSelectedRecursos = () => {
    let rows = []
    for (const recurso_id in this.state.selected_recursos) {
      const row = (
        <tr>
          <td>
            <p style={{ display: 'block', marginTop: 6, marginBottom: 0 }}>
              {this.state.selected_recursos[recurso_id]}
            </p>
          </td>
          <td></td>
          <td><Button color='danger' onClick={() => this.handleRemoveRecurso(recurso_id)}>Eliminar</Button></td>
        </tr>
      )
      rows.push(row)
    }
    return rows
  }

  render() {
    return (
      <Table striped>
        <thead className='thead-light'>
          <tr>
            <th><p style={{ display: 'block', marginBottom: 8 }}>Recurso</p></th>
            <th>{this.selectorRecurso()}</th>
            <th><Button color='primary' onClick={this.handleAgregarRecurso}>Agregar</Button></th>
          </tr>
        </thead>
        <tbody>
          {this.renderSelectedRecursos()}
        </tbody>
      </Table>
    )
  }
}
export default TablaRecursos