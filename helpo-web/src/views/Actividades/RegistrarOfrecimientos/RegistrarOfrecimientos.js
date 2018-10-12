import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import { connect } from "react-redux";
import { auth } from '../../../actions';
import './RegistrarOfrecimientos.css';
import api from '../../../api';
import ModalRegistrarOfrecimiento from './ModalRegistrarOfrecimiento/ModalRegistrarOfrecimiento';

class RegistrarOfrecimientos extends Component {
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
      funcionVoluntario: undefined,
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

  empresaTienePropuesta(evento, propuestas) {
    const filtro = propuestas.filter(
      n => n.evento.toString() === evento.id && n.empresa.id === this.getUserId()
        && ((n.aceptado !== 0 || (n.aceptado === 1 && evento.campaña)))
    );
    return filtro.length > 0;
  }

  loadNecesidadesYVoluntarios() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
      .then(res => {
        const necesidadesData = res.data;
        if (this.empresaTienePropuesta(this.state.evento.id, necesidadesData.propuestas)) {
          this.props.history.push({ pathname: '/dashboard' });
        }
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
        this.setState({ error: "Hubo un problema al cargar su información."});
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

  existeParticipacion(n) {
    return n.participaciones.filter(c => c.colaborador.id === this.getUserId()).length > 0;
  }

  getTablaNecesidades() {
    return this.state.necesidades.map((n) =>
      <tr>
        <td><i className={n.recurso.categoria.icono}></i></td>
        <td>{n.recurso.categoria.nombre}</td>
        <td>{n.recurso.nombre}</td>
        <td>{n.descripcion}</td>
        <td>{this.getCantidadNecesidades(n)}</td>
        <td>{this.getEntregado(n)}</td>
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
            color="primary"
            disabled={this.state.apiToken}
          >
            Ofrecer
          </Button>
        </td>
      );
    }
  }

  getBotonesVoluntario(n) {
    if (this.existeParticipacion(n)) {
      return (
        <td>
          <Button onClick={() => this.editParticipacion(n.id)} disabled={this.state.apiToken}
            color="warning" style={{ marginRight: 10 }}>Modificar</Button>
          <Button onClick={() => this.deleteParticipacion(n.id)} disabled={this.state.apiToken}
            color="danger">Eliminar</Button>
        </td>
      );
    } else {
      return (
        <td>
          <Button
            onClick={() => this.newParticipacion(n.id)} color="primary"
            disabled={this.state.apiToken}
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
    const voluntarios = [];
    for (let i = 0; i < this.state.voluntarios.length; i++) {
      voluntarios.push(
        <tr>
          <td><i className="cui-user"></i></td>
          <td>{this.state.voluntarios[i].funcion.nombre}</td>
          <td>{this.state.voluntarios[i].descripcion}</td>
          <td>{this.getCantidadVoluntarios(this.state.voluntarios[i])}</td>
          <td>{this.getEntregado(this.state.voluntarios[i])}</td>
          {this.getBotonesVoluntario(this.state.voluntarios[i])}
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
            <th>Presencias</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {voluntarios}
        </tbody>
      </Table>
    );
  }

  getEntregado(n) {
    if (n.funcion) {
      if (this.existeParticipacion(n)) {
        return n.participaciones.filter(p => p.colaborador.id === this.getUserId())[0].presencias;
      }
    } else {
      if (this.existeColaboracion(n)) {
        return n.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0].entregados;
      }
    }
    return '-';
  }

  newColaboracion(idNecesidad) {
    const necesidad = this.state.necesidades.filter(v => v.id === idNecesidad)[0];
    const colaboracion = {
      id: idNecesidad,
      cantidad_anterior: 0,
      cantidad: undefined,
      cantidad_restante: this.getCantidadRestante(necesidad, 0),
      entregados: 0,
      recurso: necesidad.recurso,
      descripcion: necesidad.descripcion,
      comentarios: undefined,
    }
    this.setState({ colaboracionModificada: colaboracion });
  }

  newParticipacion(idVoluntario) {
    const voluntario = this.state.voluntarios.filter(v => v.id === idVoluntario)[0];
    const participacion = {
      id: idVoluntario,
      cantidad_anterior: 0,
      cantidad: undefined,
      cantidad_restante: this.getCantidadRestante(voluntario, 0),
      presencias: 0,
      funcion: voluntario.funcion,
      descripcion: voluntario.descripcion,
      comentarios: undefined,
    }
    this.setState({ colaboracionModificada: participacion });
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
      entregados: colaboracionAnterior.entregados,
      recurso: necesidad.recurso,
      descripcion: necesidad.descripcion,
      comentarios: colaboracionAnterior.comentario,
    }
    this.setState({ colaboracionModificada: colaboracion });
  }

  editParticipacion(idParticipacion) {
    const voluntario = this.state.voluntarios.filter(v => v.id === idParticipacion)[0];
    const participacionAnterior = voluntario.participaciones.filter(c => c.colaborador.id === this.getUserId())[0];
    const participacion = {
      id: idParticipacion,
      cantidad_anterior: participacionAnterior.cantidad,
      cantidad: participacionAnterior.cantidad,
      cantidad_restante: this.getCantidadRestante(voluntario, participacionAnterior.cantidad),
      presencias: participacionAnterior.presencias,
      funcion: voluntario.funcion,
      descripcion: voluntario.descripcion,
      comentarios: participacionAnterior.comentario,
    }
    this.setState({ colaboracionModificada: participacion });
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

  deleteParticipacion(participacion_id) {
    var _this = this;
    this.setState({ apiToken: true });
    const participacionAnterior = this.getParticipacionAnterior(participacion_id);
    api.delete('/actividades/participaciones/' + participacionAnterior + '/')
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });

  }

  saveColaboracion(colaboracion) {
    var _this = this;
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
        }).catch((error) => {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
        });
    }
  }

  saveEditColaboracion(colaboracion) {
    var _this = this;
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
      }).catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });
  }

  saveEditParticipacion(participacion) {
    var _this = this;
    const participacionAnterior = this.getParticipacionAnterior(participacion.id);
    const nuevaParticipacion = {
      id: participacionAnterior,
      cantidad: participacion.cantidad,
      comentario: participacion.comentarios,
      necesidad_voluntario_id: participacion.id,
    }
    api.put('/actividades/participaciones/' + participacionAnterior + '/', nuevaParticipacion)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });
  }

  deleteColaboracion(idNecesidad) {
    var _this = this;
    this.setState({ apiToken: true });
    const colaboracionAnterior = this.getColaboracionAnterior(idNecesidad);
    api.delete('/actividades/colaboraciones/' + colaboracionAnterior + '/')
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidadesYVoluntarios();
      }).catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
      });
  }

  getColaboracionAnterior(necesidadId) {
    const necesidad = this.state.necesidades.filter(n => n.id === necesidadId)[0];
    return necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0].id;
  }

  getParticipacionAnterior(voluntarioId) {
    const voluntario = this.state.voluntarios.filter(n => n.id === voluntarioId)[0];
    return voluntario.participaciones.filter(c => c.colaborador.id === this.getUserId())[0].id;
  }

  saveParticipacion(participacion) {
    var _this = this;
    if (participacion.cantidad_anterior > 0) {
      this.saveEditParticipacion(participacion);
    } else {
      const nuevaParticipacion = {
        comentario: participacion.comentarios,
        necesidad_voluntario_id: participacion.id,
        cantidad: participacion.cantidad
      };
      api.post('/actividades/participaciones/', nuevaParticipacion)
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadNecesidadesYVoluntarios();
        }).catch((error) => {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
        });
    }
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
            <i className="fa fa-align-justify"></i> Complete su ofrecimiento para {nombreEvento}
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
                    <th>Entregados</th>
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
        <ModalRegistrarOfrecimiento
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrarOfrecimientos);