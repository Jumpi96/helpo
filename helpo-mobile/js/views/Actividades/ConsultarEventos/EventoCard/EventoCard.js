import React, { Component } from 'react';
import { Button, Icon, Card, CardItem, Text, Thumbnail, Right, Left, Body } from 'native-base';
import moment from 'moment';
import styles from './styles';

const logo = require('../../../../../img/logo.png');

function recortarDescripcion(descripcion) {
  const recorte = 100;
  if (descripcion.length > recorte) {
    return `${descripcion.substring(0, 100)}...'`;
  }
  return descripcion;
}

class EventoCard extends Component {

  static propTypes = {
    evento: React.PropTypes.object,
  };

  render() {
    const evento = this.props.evento;
    return (
      <Card style={styles.mb}>
        <CardItem bordered>
          <Left>
            <Thumbnail source={logo} />
            <Body>
              <Text>Nombre de ONG</Text>
              <Text note>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text style={{ fontWeight: '600' }}>
              {evento.nombre}
            </Text>
            <Text>
              {recortarDescripcion(evento.descripcion)}
            </Text>
          </Body>
        </CardItem>
        <CardItem style={{ paddingVertical: 0 }}>
          <Right>
            <Button>
              <Icon name="navigate" />
              <Text>Ver más</Text>
            </Button>
          </Right>
        </CardItem>
      </Card>
    );
  }
}

export default EventoCard;
