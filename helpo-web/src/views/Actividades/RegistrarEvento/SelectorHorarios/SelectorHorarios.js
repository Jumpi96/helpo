import React, { Component } from 'react';
import { Button } from 'reactstrap';


class SelectorHorarios extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      horas: this.getHoras(),
      minutos: this.getMinutos(),
      dia: 'Lunes',
      horaInicio: '00',
      minutoInicio: '00',
      horaFin: '00',
      minutoFin: '00',
      error: ''
    }
    this.handleChangeDia = this.handleChangeDia.bind(this);
    this.handleChangeHoraInicio = this.handleChangeHoraInicio.bind(this);
    this.handleChangeMinutoInicio = this.handleChangeMinutoInicio.bind(this);
    this.handleChangeHoraFin = this.handleChangeHoraFin.bind(this);
    this.handleChangeMinutoFin = this.handleChangeMinutoFin.bind(this);
    this.addHorario = this.addHorario.bind(this);
  }

  getHoras() {
    let horas = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        horas.push('0' + i.toString());
      } else {
        horas.push(i.toString());
      }
    }
    return horas;
  }

  getMinutos() {
    let minutos = [];
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        minutos.push('0' + i.toString());
      } else {
        minutos.push(i.toString());
      }
    }
    return minutos;
  }

  handleChangeDia(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ dia: selectedId });
  }

  handleChangeHoraInicio(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ horaInicio: selectedId });
  }

  handleChangeMinutoInicio(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ minutoInicio: selectedId });
  }

  handleChangeHoraFin(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ horaFin: selectedId });
  }

  handleChangeMinutoFin(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ minutoFin: selectedId });
  }

  addHorario(event) {
    event.preventDefault();
    if (true) {
      let horarios = this.props.horarios.splice(0);
      horarios.push([
        this.state.dia,
        this.state.horaInicio + ':' + this.state.minutoInicio,
        this.state.horaFin + ':' + this.state.minutoFin,
      ]);
      this.props.onHorariosChange(horarios);
    }
  }

  handleDelete(e, horario) {
    e.stopPropagation();
    let horarios = this.props.horarios;
    horarios = horarios.filter(h => JSON.stringify(h) !== JSON.stringify(horario))
    this.props.onHorariosChange(horarios);
  }

  getHorarios() {
    let { horarios } = this.props;
    if (horarios.length > 0) {
      const listaHorarios = [];
      for (let i = 0; i < horarios.length; i++) {
        listaHorarios.push(
          <div className="row offset-md-1">
            <div className="col-md-1" style={{ marginTop: '15px' }}>
              <p>{horarios[i][0]}</p>
            </div>
            <div className="col-md-1" style={{ marginTop: '15px' }}>
              <p>{horarios[i][1] + " - " + horarios[i][2]}</p>
            </div>
            <Button key={i} type="button" class="close" aria-label="Close" onClick={(e) => this.handleDelete(e, horarios[i])}>
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
        )
      }
      return (
        <div style={{ marginTop: '15px' }}>
          {listaHorarios}
        </div>
      );
    }
  }

  render() {
    const opcionesDias = this.state.dias.map((d) =>
      <option key={d} data-key={d}>{d}</option>
    );
    const opcionesHoras = this.state.horas.map((h) =>
      <option key={h} data-key={h}>{h}</option>
    );
    const opcionesMinutos = this.state.minutos.map((m) =>
      <option key={m} data-key={m}>{m}</option>
    );
    return (
      <div className="form-group">
        <div className="row">
          <label style={{ marginLeft: '12px' }}>Horarios de atención</label>
        </div>
        <div className="row">
          <div className="col-md-2">
            <select
              value={this.state.dia}
              className="form-control"
              onChange={this.handleChangeDia}>
              {opcionesDias}
            </select>
          </div>
          <label for="horaInicio" style={{ marginTop: '5px', marginRight: '10px' }}>Desde:</label>
          <div className="row col-md-1">
            <select
              name="horaInicio"
              value={this.state.horaInicio}
              className="form-control"
              onChange={this.handleChangeHoraInicio}>
              {opcionesHoras}
            </select>
          </div>
          <div className="col-md-1">
            <select
              value={this.state.minutoInicio}
              className="form-control"
              onChange={this.handleChangeMinutoInicio}>
              {opcionesMinutos}
            </select>
          </div>
          <label for="horaFin" style={{ marginTop: '5px', marginRight: '10px' }}>Hasta:</label>
          <div className="col-md-1">
            <select
              value={this.state.horaFin}
              className="form-control"
              onChange={this.handleChangeHoraFin}>
              {opcionesHoras}
            </select>
          </div>
          <div className="col-md-1">
            <select
              value={this.state.minutoFin}
              className="form-control"
              onChange={this.handleChangeMinutoFin}>
              {opcionesMinutos}
            </select>
          </div>
          <Button type="button" color="success" onClick={this.addHorario}>Agregar</Button>
        </div>
        {this.getHorarios()}
      </div>
    );
  }
}

export default SelectorHorarios;