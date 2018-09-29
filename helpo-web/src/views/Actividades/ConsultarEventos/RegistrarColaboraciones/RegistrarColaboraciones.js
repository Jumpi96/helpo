import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from "react-redux";
import { auth } from '../../../../actions';
import './RegistrarColaboraciones.css';
import api from '../../../../api';
import ModalRegistrarColaboracion from './ModalRegistrarColaboracion/ModalRegistrarColaboracion';


class RegistrarColaboraciones extends Component {
  constructor(props) {
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
      evento: { id: evento },
      necesidades: [],
      voluntarios: [],
      funcionVoluntario: undefined
    };
    this.selectFuncion = this.selectFuncion.bind(this);
    this.getTablaVoluntarios = this.getTablaVoluntarios.bind(this);
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
          funcionVoluntario: this.getNecesidadVoluntario(necesidadesData.voluntarios),
          apiToken: false
        });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
  }

  getNecesidadVoluntario(necesidades) {
    const usuario = this.getUserId();
    for (let i = 0; i < necesidades.length; i++) {
      if (necesidades[i].participaciones.filter(c => c.colaborador.id === usuario).length > 0) {
        return necesidades[i].id;
      }
    }
    return 0;
  }

  existeColaboracion(n) {
    return n.colaboraciones.filter(c => c.colaborador.id === this.getUserId()).length > 0;
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
          <Button onClick={() => this.editColaboracion(n.id)} disabled={this.state.apiToken}
            color="warning" style={{ marginRight: 10 }}>Modificar</Button>
          <Button onClick={() => this.deleteColaboracion(n.id)} disabled={this.state.apiToken}
            color="danger">Eliminar</Button>
        </td>
      );
    } else {
      return (
        <td>
          <Button
            onClick={() => this.newColaboracion(n.id)}
            color="primary" disabled={this.state.apiToken}
          >
            Ofrecer
          </Button>
        </td>
      );
    }
  }

  selectFuncion(e) {
    this.setState({ funcionVoluntario: parseInt(e.target.value, 10) });
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    n.colaboraciones.forEach((c) => { contador += c.cantidad });
    return '' + contador + '/' + n.cantidad;
  }

  getCantidadVoluntarios(v) {
    let contador = 0;
    v.participaciones.forEach((c) => { contador += c.cantidad });
    return '' + contador + '/' + v.cantidad;
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
              type="radio"
              value={this.state.voluntarios[i].id}
              checked={funcion === this.state.voluntarios[i].id}
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
                type="radio"
                value={0} checked={funcion === 0}
                onClick={this.selectFuncion}
              />
            </td>
            <td>
              <Button
                color="primary" onClick={() => this.openModalParticipacion()}
                disabled={this.state.apiToken}
              >
                Ofrecer
              </Button></td>
          </tr>
        </tbody>
      </Table>
    );
  }

  newColaboracion(idNecesidad) {
    const necesidad = this.state.necesidades.filter(v => v.id === idNecesidad)[0];
    const colaboracion = {
      id: idNecesidad,
      cantidad_anterior: 0,
      cantidad: undefined,
      cantidad_restante: this.getCantidadRestante(necesidad, 0),
      recurso: necesidad.recurso,
      descripcion: necesidad.descripcion,
      comentarios: undefined,
    }
    this.setState({ colaboracionModificada: colaboracion });
  }

  getCantidadRestante(necesidad, aportado) {
    let contador = 0;
    if (!necesidad.funcion) {
      necesidad.colaboraciones.forEach((c) => { contador += c.cantidad });
    } else {
      necesidad.participaciones.forEach((c) => { contador += c.cantidad });
    }
    return necesidad.cantidad - contador + aportado;
  }

  editColaboracion(idNecesidad) {
    const necesidad = this.state.necesidades.filter(v => v.id === idNecesidad)[0];
    const colaboracionAnterior = necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0];
    const colaboracion = {
      id: idNecesidad,
      cantidad_anterior: colaboracionAnterior.cantidad,
      cantidad: colaboracionAnterior.cantidad,
      cantidad_restante: this.getCantidadRestante(necesidad, colaboracionAnterior.cantidad),
      recurso: necesidad.recurso,
      descripcion: necesidad.descripcion,
      comentarios: colaboracionAnterior.comentario,
    }
    this.setState({ colaboracionModificada: colaboracion });
  }


  openModalParticipacion() {
    const voluntario = this.state.voluntarios.filter(v => v.id === this.state.funcionVoluntario)[0];
    const participacionVoluntario = this.getNecesidadVoluntario(this.state.voluntarios) === this.state.funcionVoluntario;
    if (!participacionVoluntario) {
      if (this.state.funcionVoluntario !== 0) {
        const participacion = {
          id: this.state.funcionVoluntario,
          cantidad_anterior: participacionVoluntario,
          cantidad: participacionVoluntario,
          cantidad_restante: this.getCantidadRestante(voluntario, participacionVoluntario),
          funcion: voluntario.funcion,
          descripcion: voluntario.descripcion,
          comentarios: undefined,
        }
        this.setState({ colaboracionModificada: participacion });
      } else {
        this.setState({ apiToken: true });
        this.deleteParticipacion();
      }
    }
  }

  saveColaboracionModal(guardar) {
    if (guardar) {
      this.setState({ apiToken: true });
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


  getIdParticipacionVoluntario() {
    const necesidades = this.state.voluntarios;
    const usuario = this.getUserId();
    let participaciones;
    for (let i = 0; i < necesidades.length; i++) {
      participaciones = necesidades[i].participaciones.filter(c => c.colaborador.id === usuario);
      if (participaciones.length > 0) {
        return participaciones[0].id;
      }
    }
    return undefined;
  }

  deleteParticipacion() {
    const participacionAEliminar = this.getIdParticipacionVoluntario();
    api.delete('/actividades/participaciones/' + participacionAEliminar + '/')
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });

  }

  saveColaboracion(colaboracion) {
    if (colaboracion.cantidad_anterior > 0) {
      this.saveEditColaboracion(colaboracion);
    } else {
      const nuevaColaboracion = {
        cantidad: colaboracion.cantidad,
        comentario: colaboracion.comentarios,
        necesidad_material_id: colaboracion.id,
      }
      api.post('/actividades/colaboraciones/', nuevaColaboracion)
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadNecesidadesYVoluntarios();
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
        });
    }
  }

  saveEditColaboracion(colaboracion) {
    const colaboracionAnterior = this.getColaboracionAnterior(colaboracion.id);
    const nuevaColaboracion = {
      id: colaboracionAnterior,
      cantidad: colaboracion.cantidad,
      comentario: colaboracion.comentarios,
      necesidad_material_id: colaboracion.id,
    }
    api.put('/actividades/colaboraciones/' + colaboracionAnterior + '/', nuevaColaboracion)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });
  }

  deleteColaboracion(idNecesidad) {
    this.setState({ apiToken: true });
    const colaboracionAnterior = this.getColaboracionAnterior(idNecesidad);
    api.delete('/actividades/colaboraciones/' + colaboracionAnterior + '/')
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });
  }

  getColaboracionAnterior(necesidadId) {
    const necesidad = this.state.necesidades.filter(n => n.id === necesidadId)[0];
    return necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0].id;
  }

  saveParticipacion(participacion) {
    const nuevaParticipacion = {
      comentario: participacion.comentarios,
      necesidad_voluntario_id: participacion.id,
      cantidad: 1,
    };
    if (this.getNecesidadVoluntario(this.state.voluntarios) !== this.state.funcionVoluntario) {
      this.deleteParticipacion();
    }
    api.post('/actividades/participaciones/', nuevaParticipacion)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch(function (error) {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
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