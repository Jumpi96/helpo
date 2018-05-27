import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarNecesidades.css';
import SelectorItem from './SelectorItem/SelectorItem';
import NumericInput from 'react-numeric-input';
import api from '../../../api';
import ModalEliminarItem from './ModalEliminarItem/ModalEliminarItem';
import ModalEditarItem from './ModalEditarItem/ModalEditarItem'


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
      necesidadModificada: { recurso: {} }
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
      this.addNecesidad(necesidad);
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
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
  }

  saveNecesidad(cantidad) {
    if (!cantidad) {
      const nuevaNecesidad = {
        id: this.state.necesidadModificada.id,
        recurso_id: this.state.necesidadModificada.recurso.id,
        descripcion: this.state.necesidadModificada.descripcion,
        cantidad: cantidad,
        evento: 2 //this.props.evento
      };
      api.put("/actividades/necesidades/" + nuevaNecesidad.id + "/", nuevaNecesidad)
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.cleanNecesidad();
          this.loadNecesidades();
        }).catch(function (error) {
          if (error.response){ console.log(error.response.status) }
          else { console.log('Error: ', error.message)}
          this.setState({ error: "Hubo un problema al cargar su información." });
        });
    }
    this.setState({
      showModalEditar: false,
      necesidadModificada: { recurso: {} }
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
    this.setState({ 
      showModalEditar: true,
      necesidadModificada: necesidad
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

  deleteNecesidad(id) {
    const necesidad = this.state.necesidades.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEliminar: true,
      necesidadModificada: necesidad
    });
    
  }

  confirmDeleteNecesidad(res) {
    if (res) {
      api.delete('/actividades/necesidades/' + this.state.necesidadModificada.id)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
    }
    this.setState({
      necesidadModificada: { recurso: {} },
      showModalEliminar: false
    })
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
        this.setState({ error: "Hubo un problema al cargar su información." });
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

  render() {
    const tablaNecesidades = this.state.necesidades.map((n) =>
      <tr>
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
                    <NumericInput className="form-control" min="1" placeholder="Cantidad"
                      value={this.state.cantidad} 
                      onChange={(num) => this.setState({ cantidad: num })}/>
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
                    <Button outline type="submit" color="success">Agregar</Button>
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
        <ModalEliminarItem open={this.state.showModalEliminar} recurso={this.state.necesidadModificada.recurso.id}
          closeModal={this.confirmDeleteNecesidad}/>
        <ModalEditarItem open={this.state.showModalEditar} necesidad={this.state.necesidadModificada.id}
          closeModal={this.saveNecesidad}/>
      </div>
    )
  }
}
  
  export default RegistrarNecesidades;