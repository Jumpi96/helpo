import React, { Component } from 'react';
import { connect } from "react-redux";
import BotonHelpo from '../../../common/BotonHelpo/BotonHelpo'
import api from '../../../../api';
import './ComentariosEvento.css'

class ComentariosEvento extends Component {

  constructor(props) {
    super(props);
    const usuario = this.getUserId();
    this.state = {
      participante: this.participante(this.props.evento, usuario),
      comentario: '',
    }
    this.handleRetroalimentacion = this.handleRetroalimentacion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleComentar = this.handleComentar.bind(this);
  }

  getOpcionComentar() {
    if (this.existeComentario(this.getUserId())) {
      return undefined;
    }
    return (
      <div className="row">
        <div className="col-md-10">
          <input type="text" name="comentario" className="form-control"
            placeholder="Escribe tu comentario..."
            value={this.state.comentario}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary" onClick={this.handleComentar}>Comentar</button>
        </div>
      </div>
    )
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleComentar() {
    const comentario = {
      comentario: this.state.comentario,
      evento_id: this.props.evento.id,
      voluntario_id: this.getUserId()
    }
    api.post('feedbacks/comentarios/', comentario)
      .then((res) => {
        this.props.update();
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      });
  }

  existeComentario(usuario) {
    return this.props.evento.comentarios.filter(c => c.voluntario.id === usuario).length > 0;
  }

  esPatrocinadora(voluntario) {
    return this.props.evento.propuestas.filter(p => p.empresa.id === voluntario && p.aceptado === 1).length > 0;
  }

  getOpiniones() {
    const { comentarios } = this.props.evento;
    if (comentarios.length > 0) {
      const opiniones_empresas = [];
      const opiniones_voluntarios = [];
      let comentario;
      for (let i = 0; i < comentarios.length; i++) {
        comentario = (
          <div className="row">
            <div className="col-md-2">
              <p className="text-right font-weight-bold">{
                comentarios[i].voluntario.apellido !== null ?
                  comentarios[i].voluntario.nombre + " " + comentarios[i].voluntario.apellido
                  : comentarios[i].voluntario.nombre
              }</p>
            </div>
            <div className="col-md-10">
              <p>{comentarios[i].comentario}</p>
            </div>
          </div>
        );
        if (this.esPatrocinadora(comentarios[i].voluntario_id)) {
          opiniones_empresas.push(comentario);
        } else {
          opiniones_voluntarios.push(comentario);
        }
      }
      return (
        <div>
          {opiniones_empresas.length > 0 ?
            <div>
              <h3>Opiniones de patrocinadores</h3>
              {opiniones_empresas}
            </div> : undefined
          }
          {opiniones_voluntarios.length > 0 ?
            <div>
              <h3>Opiniones de voluntarios</h3>
              {opiniones_voluntarios}
            </div> : undefined
          }
        </div>
      )
    }
  }

  dioRetroalimentacion(evento, usuario) {
    const necesidades = evento.necesidades;
    const voluntarios = evento.voluntarios;
    let filtroNecesidades;
    for (let i = 0; i < necesidades.length; i++) {
      filtroNecesidades = necesidades[i].colaboraciones.filter(c => c.colaborador.id === usuario);
      if (filtroNecesidades.length > 0 && filtroNecesidades[0].retroalimentacion_voluntario) {
        return true;
      }
    }
    let filtroVoluntarios;
    for (let i = 0; i < voluntarios.length; i++) {
      filtroVoluntarios = voluntarios[i].participaciones.filter(c => c.colaborador.id === usuario);
      if (filtroVoluntarios.length > 0 && filtroVoluntarios[0].retroalimentacion_voluntario) {
        return true;
      }
    }
    return false;
  }

  handleRetroalimentacion() {
    api.post('feedbacks/retroalimentacion_voluntario/', { evento: this.props.evento.id })
      .then((res) => {
        this.props.update();
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  getOpcionRetroalimentacion() {
    if (!this.dioRetroalimentacion(this.props.evento, this.getUserId())) {
      return (
        <div style={{ margin: '10px' }}>
          <BotonHelpo
            titulo={'Dar una mano'}
            disabled={false}
            mensaje={'Ayuda a la ONG en helpo si te gustó ser parte de esta actividad.'}
            onClick={this.handleRetroalimentacion}
          />
        </div>
      )
    } else {
      return (
        <div style={{ margin: '10px' }}>
          <BotonHelpo
            titulo={'Dar una mano'}
            disabled={true}
            mensaje={'Ya diste una mano a la ONG por este evento.'}
          />
        </div>
      )
    }
  }

  participante(evento, usuario) {
    const necesidades = evento.necesidades;
    const voluntarios = evento.voluntarios;
    for (let i = 0; i < necesidades.length; i++) {
      if (necesidades[i].colaboraciones.filter(c => c.colaborador.id === usuario).length > 0) {
        return true;
      }
    }
    for (let i = 0; i < voluntarios.length; i++) {
      if (voluntarios[i].participaciones.filter(c => c.colaborador.id === usuario).length > 0) {
        return true;
      }
    }
    return false;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  render() {
    const opiniones = this.getOpiniones();
    return (
      <div className="offset-md-1">
        <h2>{ "Opiniones sobre " +
          (this.props.evento.campaña ?
            'la campaña' : 'el evento')
          }</h2>
        {this.state.participante ?
          this.getOpcionRetroalimentacion()
          : undefined}
        {this.state.participante ?
          this.getOpcionComentar()
          : undefined}
        <br />
        {opiniones}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, undefined)(ComentariosEvento);