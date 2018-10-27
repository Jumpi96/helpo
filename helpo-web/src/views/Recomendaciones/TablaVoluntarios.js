import React from 'react'
import { Table, Button, Input } from 'reactstrap'

class TablaVoluntarios extends React.Component {

  selectorRubro = () => {

    return (
      <Input type="select" name="selectRubro" id="selectRubro">
        <option value='1'>Arquitecto</option>
        <option value='1'>Abogado</option>
      </Input>
    )
  }

  render() {
    return (
      <Table striped>
        <thead className='thead-light'>
          <tr>
            <th><p style={{display: 'block', marginBottom: 8}}>Función</p></th>
            <th>{this.selectorRubro()}</th>
            <th><Button color='primary'>Agregar</Button></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Abogado</td>
            <td></td>
            <td><Button color='danger'>Eliminar</Button></td>
            
          </tr>
        </tbody>
      </Table>
    )
  }
}
export default TablaVoluntarios