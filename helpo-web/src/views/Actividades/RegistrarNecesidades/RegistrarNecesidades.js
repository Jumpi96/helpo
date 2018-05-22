import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarNecesidades.css';
import SelectorItem from './SelectorItem/SelectorItem';

class RegistrarNecesidades extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete las necesidades del evento
          </CardHeader>
          <CardBody>
            <div className="form-group">
              <div className="row">
                <div className="col-md-4">
                  <SelectorItem />
                </div>
                <div className="col-md-2">
                  <input type="text" 
                    name="cantidad" className="form-control"
                    placeholder="Cantidad"
                    value={this.state.cantidad} 
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <input type="text" 
                    name="descripcion" className="form-control"
                    placeholder="Descripción"
                    value={this.state.descripcion} 
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="col-md-2">
                  <Button outline color="success">Agregar</Button>
                </div>
              </div>
            </div>
            <Table responsive striped>
              <thead>
              <tr>
                <th></th>
                <th>Categoría</th>
                <th>Ítem</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><i className="cui-bell icons"></i></td>
                <td>Ropa</td>
                <td>Sweater</td>
                <td>Tiene que ser rojo.</td>
                <td>1</td>
                <Button outline color="warning">Editar</Button>
                <Button outline color="danger">Eliminar</Button>
              </tr>
              <tr>
                <td><i className="cui-equalizer icons"></i></td>
                <td>Ropa</td>
                <td>Sweater</td>
                <td>Tiene que ser rojo.</td>
                <td>1</td>
                <Button outline color="warning">Editar</Button>
                <Button outline color="danger">Eliminar</Button>
              </tr>
              </tbody>
            </Table>

            <Button color="primary">Guardar necesidades</Button>
          </CardBody>
        </Card>
      </div>
    )
  }
}
  
  export default RegistrarNecesidades;