import React, { Component } from 'react';
import { Button } from 'reactstrap';


class SelectorHorarios extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dias: [
        { key: 1, value: 'Lunes' },
        { key: 2, value: 'Martes' },
        { key: 3, value: 'Miércoles' },
        { key: 4, value: 'Jueves' },
        { key: 5, value: 'Viernes' },
        { key: 6, value: 'Sábado' },
        { key: 7, value: 'Domingo' }
      ],
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
    this.handleValidation = this.handleValidation.bind(this);
    this.sortHorarios = this.sortHorarios.bind(this);
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
    if (this.handleValidation()) {
      let horarios = this.props.horarios.splice(0);
      horarios.push([
        this.state.dia,
        this.state.horaInicio + ':' + this.state.minutoInicio,
        this.state.horaFin + ':' + this.state.minutoFin,
      ]);
      this.props.onHorariosChange(horarios);
    }
  }

  handleValidation() {
    let error = '';
    let isValid = true;
    const horaInicio = parseInt(this.state.horaInicio, 10);
    const horaFin = parseInt(this.state.horaFin, 10);
    const minutoInicio = parseInt(this.state.minutoInicio, 10);
    const minutoFin = parseInt(this.state.minutoFin, 10);
    if ((horaFin < horaInicio) || (horaFin === horaInicio && minutoFin <= minutoInicio)) {
      error = 'El horario ingresado no es correcto.';
      isValid = false;
    }
    this.setState({ error });
    return isValid;
  }

  sortHorarios(horarios) {
    const { dias } = this.state;
    return horarios.sort(function (a, b) {
      var diaA = dias.filter(d => d.value === a[0])[0].key,
        diaB = dias.filter(d => d.value === b[0])[0].key,
        horaA = parseInt(a[1].substring(0, 2), 10),
        horaB = parseInt(b[1].substring(0, 2), 10),
        minutoA = parseInt(a[1].substring(3, 5), 10),
        minutoB = parseInt(b[1].substring(3, 5), 10);
      if (diaA === diaB && horaA === horaB && minutoA === minutoB) {
        return 0;
      } else if (diaA > diaB || (diaA === diaB && horaA > horaB) || (diaA === diaB && horaA === horaB && minutoA > minutoB)) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  handleDelete(e, horario) {
    // e.stopPropagation();
    let horarios = this.props.horarios;
    horarios = horarios.filter(h => JSON.stringify(h) !== JSON.stringify(horario))
    this.props.onHorariosChange(horarios);
  }

  getHorarios() {
    let { horarios } = this.props;
    horarios = this.sortHorarios(horarios);
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
            <button type="button" class="close" aria-label="Close" onClick={(e) => this.handleDelete(e, horarios[i])}>
              <span aria-hidden="true">&times;</span>
            </button>
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
    let opcionesDias = [];
    const { dias } = this.state;
    for (var key in this.state.dias) {
      opcionesDias.push(
        <option key={dias[key].value} data-key={dias[key].value}>{dias[key].value}</option>
      );
    }
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
          <label for="horaInicio" style={{ marginLeft: '12px', marginTop: '5px', marginRight: '10px' }}>Desde:</label>
          <div className="col-md-1">
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
          <label for="horaFin" style={{ marginLeft: '12px', marginTop: '5px', marginRight: '10px' }}>Hasta:</label>
          <div className="col-md-1">
            <select
              value={this.state.horaFin}
              className="form-control"
              onChange={this.handleChangeHoraFin}>
              {opcionesHoras}
            </select>
          </div>
          <div className="col-md-1" style={{ marginBottom: '5px' }}>
            <select
              value={this.state.minutoFin}
              className="form-control"
              onChange={this.handleChangeMinutoFin}>
              {opcionesMinutos}
            </select>
          </div>
          <div className="col-md-2">
            <Button type="button" color="success" onClick={this.addHorario}>Agregar</Button>
          </div>
          <span style={{ color: "red", marginTop: '5px', marginLeft: '15px' }}>{this.state.error}</span>
        </div>
        {this.getHorarios()}
      </div>
    );
  }
}

export default SelectorHorarios;