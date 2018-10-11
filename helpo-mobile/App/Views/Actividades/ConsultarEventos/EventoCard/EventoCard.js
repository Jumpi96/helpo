import React, { Component } from 'react';
import { 
  Button, Icon, Card, CardItem, Text, Thumbnail, Right, Left, Body, Item,
 } from 'native-base';
import moment from 'moment';
import styles from './styles';
import { helpoImages } from '../../../../Themes';


class EventoCard extends Component {

  getNecesidades() {
    const arrayNecesidades = this.props.evento.necesidades ? this.props.evento.necesidades : [];
    const necesidades = arrayNecesidades.slice(0, 2).map((necesidad) => {
      return (
        <Item key={necesidad.id}>
          <Text>
            {'-' + necesidad.recurso.categoria.nombre + ' - ' + necesidad.recurso.nombre}
          </Text>
        </Item>
      )
    });
    return necesidades;
  }

  getVoluntarios() {
    const arrayVoluntarios = this.props.evento.voluntarios ? this.props.evento.voluntarios : [];
    const voluntarios = arrayVoluntarios.slice(0, 2).map((voluntario) => {
      return (
        <Item key={voluntario.id}>
          <Text>
            {'-' + voluntario.funcion.nombre}
          </Text>
        </Item>
      );
    });
    return voluntarios;
  }

  getFecha() {
    const { evento } = this.props;
    if (evento.campaña) {
      return moment(evento.fecha_hora_inicio).format('DD/MM/YYYY') +
        " - " + moment(evento.fecha_hora_fin).format('DD/MM/YYYY');
    } else {
      return moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm');
    }
  }

  render() {
    const evento = this.props.evento;
    return (
      <Card style={styles.mb}>
        <CardItem bordered>
          <Left>
            <Thumbnail source={{uri: evento.organizacion.avatar}} />
            <Body>
              <Text>{evento.organizacion ? evento.organizacion.nombre : undefined }</Text>
              <Text note>{this.getFecha()}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text style={{ fontWeight: '600' }}>
              {evento.campaña ? "Campaña" : "Evento"}{" - " + evento.nombre}
            </Text>
            {this.getNecesidades()}
          </Body>
        </CardItem>
        <CardItem style={{ paddingVertical: 0 }}>
          <Left>
            <Button onPress={() => this.props.openEvento()}>
              <Icon name="navigate" />
              <Text>Ver más</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

export default EventoCard;
