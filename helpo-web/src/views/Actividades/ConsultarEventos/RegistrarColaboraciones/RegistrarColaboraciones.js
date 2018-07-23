import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import './RegistrarColaboraciones.css';
import SelectorItem from '../../RegistrarNecesidades/SelectorItem/SelectorItem';
import ListaFunciones from '../../RegistrarNecesidades/ListaFunciones/ListaFunciones';
import NumericInput from 'react-numeric-input';
import api from '../../../../api';


class RegistrarColaboraciones extends Component {
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
    api.post('/actividades/necesidades/', necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error_necesidad: "Hubo un problema al cargar su información." });
      });
  }

  addVoluntario(voluntario) {
    api.post('/actividades/voluntarios/', voluntario)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanVoluntario();
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error_voluntario: "Hubo un problema al cargar su información." });
      });
  }

  saveNecesidad(cantidad) {
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
            this.setState({ error: "Hubo un problema al cargar su información." });
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
            this.setState({ error: "Hubo un problema al cargar su información." });
          });
      }
      
    }
    this.setState({
      showModalEditar: false,
      necesidadModificada: undefined
    });    
  }

  handleValidationNecesidad() {
    let formIsValid = true;
    var error = this.state.error_necesidad;
    if (this.state.recurso_id === 0 || 
      !this.state.recurso_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar los recursos.";
    } else {
      error = undefined;
    }
    if (!this.state.descripcion_necesidad) {
      formIsValid = false;
      error = "Debe ingresar una descripción para la necesidad.";
    } else {
      error = undefined;
    }
    this.setState({error_necesidad: error});
    return formIsValid;
  }

  handleValidationVoluntario() {
    let formIsValid = true;
    var error = this.state.error_voluntario;
    if (this.state.funcion_id === 0 || 
      !this.state.funcion_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar las funciones.";
    } else {
      error = undefined;
    }
    if (!this.state.descripcion_voluntario) {
      formIsValid = false;
      error = "Debe ingresar una descripción para la necesidad de voluntario.";
    } else {
      error = undefined;
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
      descripcion_necesidad: undefined,
      cantidad_necesidad: undefined,
      recurso_id: undefined,
      necesidad: undefined
    });
  }

  cleanVoluntario() {
    this.setState({
      descripcion_voluntario: undefined,
      cantidad_voluntario: undefined,
      funcion_id: undefined,
      voluntario: undefined
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
        <td><Button onClick={() => this.editNecesidad(n.id)}
        disabled={this.state.necesidad} color="warning">Modificar</Button></td>
        <td><Button onClick={() => this.deleteNecesidad(n.id)}
          disabled={this.state.necesidad} color="danger">Eliminar</Button></td>
      </tr>
    );
  }

  getTablaVoluntarios() {
    const voluntarios = [];
    for (let i = 0; i < this.state.voluntarios.length; i++) {
      voluntarios.push(
        <tr>
          <td><i className="cui-user"></i></td>
          <td>{this.state.voluntarios[i].funcion.nombre}</td>
          <td>{this.state.voluntarios[i].descripcion}</td>
          <td>{this.state.voluntarios[i].cantidad}</td>
          <td><input type="radio" name="voluntario" value={this.state.voluntarios[i].id}></input></td>
          <td></td>
        </tr>
      )
    }
    return (
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
          {voluntarios}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>No participa</td>
            <td><input type="radio" name="voluntario" value={0}></input></td>
            <td><Button color="primary">Ofrecer</Button></td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete sus colaboraciones para
          </CardHeader>
          <CardBody>
            <form>
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
              <hr />
              {this.getTablaVoluntarios()}
            </form>
          </CardBody>
        </Card>
      </div>
    )
  }
}
  
  export default RegistrarColaboraciones;