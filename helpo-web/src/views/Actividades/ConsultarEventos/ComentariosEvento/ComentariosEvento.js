import React, { Component } from 'react';
import { connect } from "react-redux";

class ComentariosEvento extends Component {

  constructor(props) {
    super(props);
    const usuario = this.getUserId();
    this.state = {
      voluntario_id: usuario,
      participante: this.participante(usuario),
      dioRetroalimentacion: this.dioRetroalimentacion(usuario)
    }
  }

  getOpcionComentar() {
    return (
      <div className="row">
        <div className="col-md-10">
          <input type="text" name="nombre" className="form-control"
            placeholder="Escribe tu comentario..."
            onChange={this.handleChange}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary">Comentar</button>
        </div>
      </div>
    )
  }

  getOpiniones() {
    if (this.props.comentarios) {
      const opiniones = this.props.comentarios.map((c) =>
        <div className="row">
            <div className="col-md-2">
            <b>{c.voluntario.nombre}</b>
            </div>
            <div className="col-md-2">
            <label>{c.comentario}</label>
            </div>
        </div>
      );
      return opiniones;
    }
  }

  dioRetroalimentacion(usuario) {
    return false;
  }

  getOpcionRetroalimentacion() {
    if (!this.state.dioRetroalimentacion) {
      return (
        <div className="form-group">
          <button class="btn btn-primary"><i class="fa fa-thumbs-up"></i>Me gustó el evento</button>
          <label>Ayuda a la ONG en helpo si te gustó ser parte de esta actividad.</label>
        </div>
      )
    } else {
      return (
        <div className="form-group">
          <button class="btn btn-primary" disabled><i class="fa fa-thumbs-up"></i></button>
          <label className="label-group">Indicaste que te gustó el evento</label>
        </div>
      )
    }    
  }

  participante(usuario) {
    const necesidades = this.props.evento.necesidades;
    const voluntarios = this.props.evento.voluntarios;
    for (let i=0; i < necesidades.length; i++) {
      if (necesidades[i].colaboraciones.filter(c => c.voluntario.id === usuario).length > 0){
        return true;
      }
    }
    for (let i=0; i < voluntarios.length; i++) {
      if (voluntarios[i].participaciones.filter(c => c.voluntario.id === usuario).length > 0){
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
        <h2>Opiniones del evento</h2>
        {this.state.participante ?
          this.getOpcionRetroalimentacion()
        : undefined}
        {this.state.participante ?
          this.getOpcionComentar()
        : undefined}
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