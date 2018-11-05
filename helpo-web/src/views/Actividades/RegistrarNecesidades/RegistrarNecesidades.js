import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarNecesidades.css';
import SelectorItem from './SelectorItem/SelectorItem';
import ListaFunciones from './ListaFunciones/ListaFunciones';
import NumericInput from 'react-numeric-input';
import api from '../../../api';
import ModalEliminarNecesidad from './ModalEliminarNecesidad/ModalEliminarNecesidad';
import ModalEditarItem from './ModalEditarItem/ModalEditarItem';


class RegistrarNecesidades extends Component {
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
      evento: evento,
      necesidades: [],
      voluntarios: [],
      necesidad: undefined,
      voluntario: undefined,
      cantidad_necesidad: undefined,
      cantidad_voluntario: undefined,
      recurso_id: 0,
      descripcion_necesidad: undefined,
      descripcion_voluntario: undefined,
      error_voluntario: undefined,
      error_necesidad: undefined,
      showModalEliminar: false,
      showModalEditar: false,
      necesidadModificada: undefined
    };
    this.handleSubmitNecesidad = this.handleSubmitNecesidad.bind(this);
    this.handleSubmitVoluntario = this.handleSubmitVoluntario.bind(this);
    this.handleFuncionChange = this.handleFuncionChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveNecesidad = this.saveNecesidad.bind(this);
    this.confirmDeleteNecesidad = this.confirmDeleteNecesidad.bind(this);
  }

  handleSubmitNecesidad() {
    if (this.handleValidationNecesidad()) {
      const necesidad = {
        recurso_id: this.state.recurso_id,
        descripcion: this.state.descripcion_necesidad,
        cantidad: this.state.cantidad_necesidad,
        evento: this.state.evento
      }
      this.addNecesidad(necesidad);
    }
  }

  handleSubmitVoluntario() {
    if (this.handleValidationVoluntario()) {
      const voluntario = {
        funcion_id: this.state.funcion_id,
        descripcion: this.state.descripcion_voluntario,
        cantidad: this.state.cantidad_voluntario,
        evento: this.state.evento
      }
      this.addVoluntario(voluntario);
    }
  }

  addNecesidad(necesidad) {
    var _this = this;
    api.post('/actividades/necesidades/', necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        _this.setState({ error_necesidad: "Hubo un problema al cargar su información." });
      });
  }

  addVoluntario(voluntario) {
    var _this = this;
    api.post('/actividades/voluntarios/', voluntario)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanVoluntario();
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        _this.setState({ error_voluntario: "Hubo un problema al cargar su información." });
      });
  }

  saveNecesidad(cantidad) {
    var _this = this;
    if (cantidad) {
      if (this.state.necesidadModificada.funcion) {
        const nuevoVoluntario = {
          id: this.state.necesidadModificada.id,
          funcion_id: this.state.necesidadModificada.funcion.id,
          descripcion: this.state.necesidadModificada.descripcion,
          cantidad: cantidad,
          evento: this.state.evento
        }
        api.put("/actividades/voluntarios/" + nuevoVoluntario.id + '/', nuevoVoluntario)
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.cleanVoluntario();
            this.loadNecesidadesYVoluntarios();
          }).catch(function (error) {
            if (error.response){ console.log(error.response.status) }
            else { console.log('Error: ', error.message)}
            _this.setState({ error: "Hubo un problema al cargar su información." });
          });
      } else {
        const nuevaNecesidad = {
          id: this.state.necesidadModificada.id,
          recurso_id: this.state.necesidadModificada.recurso.id,
          descripcion: this.state.necesidadModificada.descripcion,
          cantidad: cantidad,
          evento: this.state.evento
        };
        api.put("/actividades/necesidades/" + nuevaNecesidad.id + "/", nuevaNecesidad)
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.cleanNecesidad();
            this.loadNecesidadesYVoluntarios();
          }).catch(function (error) {
            if (error.response){ console.log(error.response.status) }
            else { console.log('Error: ', error.message)}
            _this.setState({ error: "Hubo un problema al cargar su información." });
          });
      }
      
    }
    this.setState({
      showModalEditar: false,
      necesidadModificada: undefined
    });    
  }

  handleValidationNecesidad() {
    this.setState({error_necesidad:''}); 
    let formIsValid = true;
    var error = this.state.error_necesidad;
    if (this.state.recurso_id === 0 || !this.state.recurso_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar los recursos.";
    } else if (!this.state.cantidad_necesidad) {
      formIsValid = false;
      error = "Debe ingresar una cantidad para la necesidad.";
    } else if (!this.state.descripcion_necesidad) {
      formIsValid = false;
      error = "Debe ingresar una descripción para la necesidad.";
    }
    this.setState({error_necesidad: error});
    return formIsValid;
  }

  handleValidationVoluntario() {
    this.setState({error_voluntario:''}); 
    let formIsValid = true;
    var error = this.state.error_voluntario;
    if (this.state.funcion_id === 0 || !this.state.funcion_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar las funciones.";
    } else if (!this.state.cantidad_voluntario) {
      formIsValid = false;
      error = "Debe ingresar una cantidad para la necesidad de voluntario.";
    } else if (!this.state.descripcion_voluntario) {
      formIsValid = false;
      error = "Debe ingresar una descripción para la necesidad de voluntario.";
    }
    this.setState({error_voluntario: error});
    return formIsValid;
  }

  editNecesidad(id) {
    const necesidad = this.state.necesidades.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEditar: true,
      necesidadModificada: necesidad
    });
  }

  editVoluntario(id) {
    const voluntario = this.state.voluntarios.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEditar: true,
      necesidadModificada: voluntario
    });
  }

  cleanNecesidad() {
    this.setState({
      descripcion_necesidad: '',
      cantidad_necesidad: '',
      //recurso_id: '',
      necesidad: '',
      error_necesidad:''
    });
  }

  cleanVoluntario() {
    this.setState({
      descripcion_voluntario: '',
      cantidad_voluntario: '',
      //funcion_id: 0,
      voluntario: '',
      error_voluntario:'',
    });
  }

  deleteNecesidad(id) {
    const necesidad = this.state.necesidades.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEliminar: true,
      necesidadModificada: necesidad
    });
  }

  deleteVoluntario(id) {
    const voluntario = this.state.voluntarios.filter(n => n.id === id)[0];
    this.setState({ 
      showModalEliminar: true,
      necesidadModificada: voluntario
    });
  }

  confirmDeleteNecesidad(res) {
    if (res > 0) {
      const ruta = this.state.necesidadModificada.funcion ? 
        '/actividades/voluntarios/' : '/actividades/necesidades/';
      api.delete(ruta + res + '/')
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadNecesidadesYVoluntarios();
        }).catch(function (error) {
          if (error.response){ console.log(error.response.status) }
          else { console.log('Error: ', error.message)}
        });
    }
    this.setState({
      necesidadModificada: undefined,
      showModalEliminar: false
    })
  }

  componentDidMount() {
    this.loadNecesidadesYVoluntarios();
  }

  loadNecesidadesYVoluntarios() {
    api.get('/actividades/necesidades/?evento=' + this.state.evento)
      .then(res => {
        const necesidadesData = res.data;
        api.get('/actividades/voluntarios/?evento=' + this.state.evento)
          .then(res => {
            const voluntariosData = res.data;
            this.setState({ voluntarios: voluntariosData, necesidades: necesidadesData });
          })
          .catch((error) => {
            if (error.response){ console.log(error.response.status) }
            else { console.log('Error: ', error.message)}
            this.setState({ error: "Hubo un problema al cargar su información." });
          })
        this.setState({ necesidades: necesidadesData});
      })
      .catch((error) => {
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

  handleFuncionChange(f) {
    this.setState({ funcion_id: f });
  }

  getTablaNecesidades() {
    return this.state.necesidades.map((n) =>
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
            <i className="fa fa-align-justify"></i> Complete las necesidades de la Actividad Social
          </CardHeader>
          <CardBody>
            <form>
              <div className="form-group">
                <h5>Necesidades materiales</h5>
                <div className="row">
                  <div className="col-md-4">
                    <SelectorItem 
                     item={this.state.recurso_id}
                     onItemChange={this.handleItemChange}/>
                  </div>
                  <div className="col-md-2">
                    <NumericInput className="form-control" min="1" placeholder="Cantidad"
                      value={this.state.cantidad_necesidad}
                      onChange={(num) => this.setState({ cantidad_necesidad: num })}/>
                  </div>
                  <div className="col-md-4">
                    <input type="text" 
                      name="descripcion_necesidad" className="form-control"
                      placeholder="Descripción"
                      value={this.state.descripcion_necesidad} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <Button 
                      outline
                      color="success"
                      onClick={this.handleSubmitNecesidad}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
                <span style={{color: "red"}}>{this.state.error_necesidad}</span>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.getTablaNecesidades()}
                </tbody>
              </Table>
              <div className="form-group">
                <h5>Voluntarios</h5>
                <div className="row">
                  <div className="col-md-3">
                    <ListaFunciones
                      name="listaFunciones"
                      funcion={this.state.funcion_id}
                      onFuncionChange={this.handleFuncionChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <NumericInput className="form-control" min="1" placeholder="Cantidad"
                      value={this.state.cantidad_voluntario} 
                      onChange={(num) => this.setState({ cantidad_voluntario: num })}/>
                  </div>
                  <div className="col-md-5">
                    <input type="text" 
                      name="descripcion_voluntario" className="form-control"
                      placeholder="Descripción"
                      ref="descripcion"
                      value={this.state.descripcion_voluntario} 
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <Button 
                      outline
                      color="success"
                      onClick={this.handleSubmitVoluntario}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
                <span style={{color: "red"}}>{this.state.error_voluntario}</span>
              </div>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th></th>
                    <th>Función</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.getTablaVoluntarios()}
                </tbody>
              </Table>
              <Button onClick={() => this.props.history.push('/actividades/consultar-evento?id=' + this.state.evento)} 
                color="primary">Guardar necesidades</Button>
            </form>
          </CardBody>
        </Card>
        <ModalEliminarNecesidad open={this.state.showModalEliminar} necesidad={this.state.necesidadModificada}
          closeModal={this.confirmDeleteNecesidad}/>
        <ModalEditarItem open={this.state.showModalEditar} necesidad={this.state.necesidadModificada}
          closeModal={this.saveNecesidad}/>
      </div>
    )
  }
}
  
  export default RegistrarNecesidades;