import React, { Component } from 'react';
import { Button, Icon, Card, CardItem, Text, Thumbnail, Right, Left, Body,
  Item,
 } from 'native-base';
import moment from 'moment';
import styles from './styles';

const logo = require('../../../../../img/logo.png');


class EventoCard extends Component {

  static propTypes = {
    evento: React.PropTypes.object,
  };

  getNecesidades() {
    const arrayNecesidades = this.props.evento.necesidades ? this.props.evento.necesidades : [];
    const necesidades = arrayNecesidades.slice(0, 3).map((necesidad) => {
      return (
        <Item>
          <Text>
            {'-' + necesidad.recurso.categoria.nombre + ' - ' + necesidad.recurso.nombre}
          </Text>
        </Item>
      )
    });
    return necesidades;
  }

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
            {this.getNecesidades()}
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
