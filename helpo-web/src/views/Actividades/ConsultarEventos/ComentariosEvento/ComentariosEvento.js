import React, { Component } from 'react';

class ComentariosEvento extends Component {

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

  getOpcionRetroalimentacion() {
    if (false) {
      return (
        <div className="form-group">
          <button class="btn btn-primary"><i class="fa fa-thumbs-up"></i>Me gustó el evento</button>
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

  render() {
    return (
      <div className="offset-md-1">
        <h2>Opiniones del evento</h2>
        {this.getOpcionRetroalimentacion()}
        {this.getOpcionComentar()}
        {this.getOpiniones()}
      </div>
    )
  }
}

export default ComentariosEvento;