import React, { Component } from 'react';
import { Button, Table, Card, CardBody, CardHeader } from 'reactstrap';
import moment from 'moment';


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
    const { horarios } = this.props;
    const nuevoInicio = moment(horaInicio + ':' + minutoInicio, "HH:ss");
    const nuevoFin = moment(horaFin + ':' + minutoFin, "HH:ss");
    let inicio, fin;
    if (horarios) {
      for (let i = 0; i < horarios.length; i++) {
        let h = horarios[i];
        if (this.state.dia === h[0]) {
          inicio = moment(h[1], "HH:ss");
          fin = moment(h[2], "HH:ss");
          if (nuevoInicio <= fin && nuevoFin >= inicio) {
            error = 'El horario agregado coincide con un horario ya ingresado.';
            isValid = false;
            break;
          }
        }
      }
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
          <tr>
            <td>{horarios[i][0]}</td>
            <td>{horarios[i][1] + " - " + horarios[i][2]}</td>
            <td>
              <Button onClick={(e) => this.handleDelete(e, horarios[i])} outline
                color="danger">Eliminar</Button>
            </td>
          </tr>
        )
      }
      return (
        <div className="row">
          <div className="offset-md-1 col-md-5">
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listaHorarios}
              </tbody>
            </Table>
          </div>
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
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Agregue sus horarios de atención
          </CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-md-2">
              <select
                value={this.state.dia}
                className="btn btn-mini"
                onChange={this.handleChangeDia}>
                {opcionesDias}
              </select>
            </div>
            <label for="horaInicio" style={{ marginLeft: '12px', marginTop: '5px', marginRight: '10px' }}>Desde:</label>
            <div className="col-md-1">
              <select
                name="horaInicio"
                value={this.state.horaInicio}
                className="btn btn-mini"
                onChange={this.handleChangeHoraInicio}>
                {opcionesHoras}
              </select>
            </div>
            <div className="col-md-1">
              <select
                value={this.state.minutoInicio}
                className="btn btn-mini"
                onChange={this.handleChangeMinutoInicio}>
                {opcionesMinutos}
              </select>
            </div>
            <label for="horaFin" style={{ marginLeft: '12px', marginTop: '5px', marginRight: '10px' }}>Hasta:</label>
            <div className="col-md-1">
              <select
                value={this.state.horaFin}
                className="btn btn-mini"
                onChange={this.handleChangeHoraFin}>
                {opcionesHoras}
              </select>
            </div>
            <div className="col-md-1" style={{ marginBottom: '5px' }}>
              <select
                value={this.state.minutoFin}
                className="btn btn-mini"
                onChange={this.handleChangeMinutoFin}>
                {opcionesMinutos}
              </select>
            </div>
            <div className="col-md-2">
              <Button type="button" color="success" onClick={this.addHorario}>Agregar</Button>
            </div>
          </div>
          <div className="form-group">
            <span style={{ color: "red", marginTop: '5px', marginLeft: '15px' }}>{this.state.error}</span>
          </div>
          {this.getHorarios()}
        </CardBody>
      </Card>
    );
  }
}

export default SelectorHorarios;