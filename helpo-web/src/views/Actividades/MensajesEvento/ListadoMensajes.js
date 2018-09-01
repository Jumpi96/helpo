import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import api from '../../../api';
import ModalEliminarNecesidad from './ModalEliminarNecesidad/ModalEliminarNecesidad';
import ModalEditarItem from './ModalEditarItem/ModalEditarItem';


class ListadoMensajes extends Component {
  constructor(props){
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const parametro = urlParams.get('evento');
    let evento;
    if (parametro) {
      evento = parametro;
    } else {
      this.props.history.push({ pathname: '/dashboard' });
    }
    this.state = {
      evento,
      mensajes: []
    };
  }

  componentDidMount() {
    a
  }

  getTablaVoluntarios() {
    return this.state.voluntarios.map((n) =>
      <tr>
        <td><i className="cui-user"></i></td>
        <td>{n.funcion.nombre}</td>
        <td>{n.descripcion}</td>
        <td>{n.cantidad}</td>
        <td><Button onClick={() => this.editVoluntario(n.id)} outline
          disabled={this.state.voluntario} color="warning">Editar</Button></td>
        <td><Button onClick={() => this.deleteVoluntario(n.id)} outline 
          disabled={this.state.voluntario} color="danger">Eliminar</Button></td>
      </tr>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete las necesidades del evento
          </CardHeader>
          <CardBody>
            <form>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th></th>
                    <th>Fecha</th>
                    <th>Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><i className="cui-user"></i></td>
                    <td>Un mensaje</td>
                    <td>Un mensaje</td>
                  </tr>
                </tbody>
              </Table>
              <Button onClick={() => this.props.history.push('dashboard')} 
                color="primary">Guardar necesidades</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    )
  }
}
  
  export default ListadoMensajes;