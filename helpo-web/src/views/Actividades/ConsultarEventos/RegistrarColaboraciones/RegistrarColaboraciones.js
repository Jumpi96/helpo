import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from "react-redux";
import { auth } from '../../../../actions';
import './RegistrarColaboraciones.css';
import api from '../../../../api';
import ModalRegistrarColaboracion from './ModalRegistrarColaboracion/ModalRegistrarColaboracion';


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
      evento: {id: evento},
      necesidades: [],
      voluntarios: [],
      funcionVoluntario: undefined,
    };
    this.selectFuncion = this.selectFuncion.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.saveColaboracionModal = this.saveColaboracionModal.bind(this);
  }

  componentDidMount() {
    this.loadNecesidadesYVoluntarios();
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  loadNecesidadesYVoluntarios() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
      .then(res => {
        const necesidadesData = res.data;
        this.setState({ 
          necesidades: necesidadesData.necesidades,
          voluntarios: necesidadesData.voluntarios,
          evento: necesidadesData,
          funcionVoluntario: this.getParticipacionVoluntario(necesidadesData.voluntarios),
        });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
  }
  
  getParticipacionVoluntario(necesidades) {
    const usuario = this.getUserId();
    for (let i=0; i < necesidades.length; i++) {
      if (necesidades[i].participaciones.filter(c => c.voluntario_id === usuario).length > 0){
        return necesidades[i].id;
      }
    }
    return 0;
  }

  existeColaboracion(n) {
    return n.colaboraciones.filter(c => c.voluntario_id === this.getUserId()).length > 0;
  }

  getTablaNecesidades() {
    return this.state.necesidades.map((n) =>
      <tr>
        <td><i className={n.recurso.categoria.icono}></i></td>
        <td>{n.recurso.categoria.nombre}</td>
        <td>{n.recurso.nombre}</td>
        <td>{n.descripcion}</td>
        <td>{this.getCantidadNecesidades(n)}</td>
        {this.getBotonesNecesidad(n)}
      </tr>
    );
  }

  getBotonesNecesidad(n) {
    if (this.existeColaboracion(n)) {
      return (
        <td>
          <Button onClick={() => this.editNecesidad(n.id)}
            color="warning">Modificar</Button>
          <Button onClick={() => this.deleteNecesidad(n.id)}
            color="danger">Eliminar</Button>
        </td>
      );
    } else {
      return (
        <td>
          <Button onClick={() => undefined} color="primary">Ofrecer</Button>
        </td>
      );
    }
  }

  selectFuncion(e) {
    this.setState({ funcionVoluntario: e.target.value });
  }

  getCantidadNecesidades(n) {
    return '' + n.colaboraciones.length + '/'+ n.cantidad;
  }

  getCantidadVoluntarios(v) {
    return '' + v.participaciones.length + '/'+ v.cantidad;
  }

  getTablaVoluntarios() {
    const funcion = this.state.funcionVoluntario;
    const voluntarios = [];
    for (let i = 0; i < this.state.voluntarios.length; i++) {
      voluntarios.push(
        <tr>
          <td><i className="cui-user"></i></td>
          <td>{this.state.voluntarios[i].funcion.nombre}</td>
          <td>{this.state.voluntarios[i].descripcion}</td>
          <td>{this.getCantidadVoluntarios(this.state.voluntarios[i])}</td>
          <td>
            <input 
              type="radio" name="voluntario" 
              value={this.state.voluntarios[i].id}
              checked={funcion == this.state.voluntarios[i].id}
              onClick={this.selectFuncion}
            />
          </td>
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
            <th>Participando</th>
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
            <td>
              <input 
                type="radio" name="voluntario" 
                value={0} checked={funcion == 0}
                onClick={this.selectFuncion}
              />
            </td>
            <td><Button color="primary" onClick={() => this.openModalParticipacion()}>Ofrecer</Button></td>
          </tr>
        </tbody>
      </Table>
    );
  }

  openModalParticipacion() {
    const voluntario = this.state.voluntarios.filter(v => v.id == this.state.funcionVoluntario)[0];
    const participacionVoluntario = this.getParticipacionVoluntario(this.state.voluntarios) === this.state.funcionVoluntario;
    if (!participacionVoluntario) {
      if (this.state.funcionVoluntario != 0) {
        const participacion = {
          id: this.state.funcionVoluntario,
          cantidad_anterior: participacionVoluntario,
          cantidad: participacionVoluntario,
          funcion: voluntario.funcion,
          descripcion: voluntario.descripcion,
          comentarios: undefined,
        }
        this.setState({ colaboracionModificada: participacion });
      } else {
        this.deleteParticipacion();
      }
    }
  }

  saveColaboracionModal(guardar) {
    if (guardar) {
      if (!this.state.colaboracionModificada.funcion) {
        this.saveColaboracion(this.state.colaboracionModificada);
      } else {
        this.saveParticipacion(this.state.colaboracionModificada);
      }
    }
    this.setState({
      colaboracionModificada: undefined,
    })
  }

  saveParticipacion(participacion) {
    const nuevaParticipacion = {
      comentario: participacion.comentarios,
      necesidad_voluntario_id: participacion.id,
    }
    api.post('/actividades/participaciones/', nuevaParticipacion)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
        this.setState({ error_necesidad: "Hubo un problema al cargar su información." });
      });
  }

  handleModalChange(colaboracion) {
    this.setState({ colaboracionModificada: colaboracion });
  }

  render() {
    const nombreEvento = this.state.evento ? this.state.evento.nombre : undefined;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Complete sus colaboraciones para {nombreEvento}
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
                    <th>Colaborando</th>
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
        <ModalRegistrarColaboracion 
          open={this.state.colaboracionModificada} handleChange={this.handleModalChange}
          colaboracion={this.state.colaboracionModificada} closeModal={this.saveColaboracionModal} 
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
    }
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(RegistrarColaboraciones);