import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarNecesidades.css';
import SelectorItem from './SelectorItem/SelectorItem';
import api from '../../../api';
import ModalEliminarItem from './ModalEliminarItem/ModalEliminarItem';


class RegistrarNecesidades extends Component {
  constructor(props){
    super(props);
    this.state = {
      necesidades: [],
      necesidad: undefined,
      cantidad: undefined,
      recurso_id: 0,
      descripcion: undefined,
      error: undefined,
      showModalEliminar: false,
      recursoEliminar: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const necesidad = {
        recurso_id: this.state.recurso_id,
        descripcion: this.state.descripcion,
        cantidad: this.state.cantidad,
        evento: 2 //this.props.evento
      }
      if (!this.state.necesidad){
        this.addNecesidad(necesidad);
      } else {
        necesidad.id = this.state.necesidad;
        this.saveNecesidad(necesidad);
      }
    }
  }

  addNecesidad(necesidad) {
    api.post('/actividades/necesidades/', necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  saveNecesidad(necesidad) {
    api.put("/actividades/necesidades/" + necesidad.id + "/", necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  handleValidation() {
    let formIsValid = true;
    var error = this.state.error;

    if (this.state.recurso_id === 0 || 
      !this.state.recurso_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar los recursos.";
    } else {
      error = undefined;
    }
    this.setState({error: error});
    return formIsValid;
  }

  editNecesidad(id) {
    const necesidad = this.state.necesidades.filter(n => n.id === id)[0];
    console.log(necesidad.recurso.id);
    this.setState({ 
      showModalEliminar: true,
      recursoEliminar: necesidad.recurso.id
    });
  }

  cleanNecesidad() {
    this.setState({
      descripcion: undefined,
      cantidad: undefined,
      recurso_id: undefined,
      necesidad: undefined
    });
  }

  deleteNecesidad(necesidad) {
    api.delete('/actividades/necesidades/' + necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  componentDidMount() {
    this.loadNecesidades();
  }

  loadNecesidades() {
    api.get('/actividades/necesidades/?evento=' + 2)//this.props.evento_id)
      .then(res => {
        const necesidadesData = res.data;
        this.setState({ necesidades: necesidadesData});
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  handleItemChange(r) {
    // eslint-disable-next-line
    this.setState({ recurso_id: parseInt(r) });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  getSelectorClass(id){
    if (this.state.necesidad === id) {
      return "fa fa-arrow-circle-o-right";
    } else {
      return undefined;
    }
  }

  render() {
    const tablaNecesidades = this.state.necesidades.map((n) =>
      <tr>
        <td><i className={this.getSelectorClass(n.id)}></i></td>
        <td><i className={n.recurso.categoria.icono}></i></td>
        <td>{n.recurso.categoria.nombre}</td>
        <td>{n.recurso.nombre}</td>
        <td>{n.descripcion}</td>
        <td>{n.cantidad}</td>
        <td><Button onClick={() => this.editNecesidad(n.id)} outline
          disabled={this.state.necesidad} color="warning">Editar</Button></td>
        <td><Button onClick={() => this.deleteNecesidad(n.id)} outline 
          disabled={this.state.necesidad} color="danger">Eliminar</Button></td>
      </tr>
    );
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete las necesidades del evento
          </CardHeader>
          <CardBody>
            <div className="form-group">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <SelectorItem 
                     item={this.state.recurso_id}
                     onItemChange={this.handleItemChange}/>
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
                    <Button outline type="submit" color="success">
                      { !this.state.necesidad ? "Agregar" : "Guardar" }
                    </Button>
                  </div>
                </div>
                <span style={{color: "red"}}>{this.state.error}</span>
              </form>
            </div>
            <Table responsive striped>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Categoría</th>
                  <th>Ítem</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tablaNecesidades}
              </tbody>
            </Table>
            <Button color="primary">Guardar necesidades</Button>
          </CardBody>
        </Card>
        <ModalEliminarItem open={this.state.showModalEliminar} recurso={this.state.recursoEliminar}
          closeModal={(res) => alert(res)}/>
      </div>
    )
  }
}
  
  export default RegistrarNecesidades;