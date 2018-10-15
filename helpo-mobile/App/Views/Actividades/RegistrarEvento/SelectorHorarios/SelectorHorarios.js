import React, { Component } from 'react';
import { Button, ListItem, Left, Body, Text, Picker, Separator, Item, Form, View, Icon } from 'native-base';
import styles from '../styles';


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

  handleChangeDia(value, index) {
    this.setState({ dia: value });
  }

  handleChangeHoraInicio(value, index) {
    this.setState({ horaInicio: value });
  }

  handleChangeMinutoInicio(value, index) {
    this.setState({ minutoInicio: value });
  }

  handleChangeHoraFin(value, index) {
    this.setState({ horaFin: value });
  }

  handleChangeMinutoFin(value, index) {
    this.setState({ minutoFin: value });
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

  handleDelete(horario) {
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
          <ListItem icon>
            <Left>
              <Button
                style={{ backgroundColor: '#ff0000' }}
                onPress={() => this.handleDelete(horarios[i])}
              >
                {<Icon name="calendar" family="Entypo" />}
              </Button>
            </Left>
            <Body>
              <Text>
                {horarios[i][0]}
              </Text>
              <Text
                numberOfLines={1} note
              >
                {horarios[i][1] + " - " + horarios[i][2]}
              </Text>
            </Body>
          </ListItem>
        )
      }
      return (
        <Form>
          {listaHorarios}
        </Form>
      );
    }
  }

  render() {
    let opcionesDias = [];
    const { dias } = this.state;
    for (var key in this.state.dias) {
      opcionesDias.push(
        <Item value={dias[key].value} key={dias[key].value} label={dias[key].value} />
      );
    }
    const opcionesHoras = this.state.horas.map((h) =>
      <Item value={h} key={h} label={h} />
    );
    const opcionesMinutos = this.state.minutos.map((m) =>
      <Item value={m} key={m} label={m} />
    );
    return (
      <View style={{ margin: 5 }}>
        <Separator bordered noTopBorder>
          <Text>Horarios de atención</Text>
        </Separator>
        <View style={{ flexDirection: 'row' }}>
          <Picker
            note
            mode='dropdown' style={styles.horariosPicker}
            selectedValue={this.state.dia}
            onValueChange={this.handleChangeDia}>
            {opcionesDias}
          </Picker>
          <Button
            onPress={this.addHorario}
            style={{ margin: 5 }}
          >
            <Text>Agregar</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.labelPicker}>Desde:</Text>
          <Picker
            note
            mode='dropdown' style={styles.horariosPicker}
            selectedValue={this.state.horaInicio}
            onValueChange={this.handleChangeHoraInicio}>
            {opcionesHoras}
          </Picker>
          <Picker
            note
            mode='dropdown' style={styles.horariosPicker}
            selectedValue={this.state.minutoInicio}
            onValueChange={this.handleChangeMinutoInicio}>
            {opcionesMinutos}
          </Picker>
        </View >
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.labelPicker}>Hasta:</Text>
          <Picker
            note
            mode='dropdown' style={styles.horariosPicker}
            selectedValue={this.state.horaFin}
            onValueChange={this.handleChangeHoraFin}
          >
            {opcionesHoras}
          </Picker>

          <Picker
            note
            mode='dropdown' style={styles.horariosPicker}
            selectedValue={this.state.minutoFin}
            onValueChange={this.handleChangeMinutoFin}
          >
            {opcionesMinutos}
          </Picker>
        </View>
        <Text style={styles.validationMessage}>{this.state.error}</Text>
        {this.getHorarios()}
      </View >
    );
  }
}

export default SelectorHorarios;