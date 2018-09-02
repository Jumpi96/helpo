import React, { Component } from 'react';
//import { getImagen } from '../../Lib/Imagen'; Importar para que se pueda ver imagen.
import { 
  Button, Icon, Card, CardItem, Text, Thumbnail, Right, Left, Body, Item,
 } from 'native-base';
import moment from 'moment';
import styles from './styles';

class OrganizacionCard extends Component {

  render() {
    const organizacion = this.props.organizacion;
    return (
      <Card style={styles.mb}>
        <CardItem bordered>
          <Left>
            <Thumbnail source={getImagen(organizacion ? organizacion.usuario.avatar : undefined )} />
            <Body>
              <Text style={{ fontWeight: '600' }}>{organizacion.usuario.nombre ? organizacion.usuario.nombre : undefined }</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              {organizacion.descripcion}
            </Text>
          </Body>
        </CardItem>
        <CardItem style={{ paddingVertical: 0 }}>
          <Left>
            <Button onPress={() => this.props.openEvento()}>
              <Icon name="navigate" />
              <Text>Ver perfil</Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    );
  }
}

export default OrganizacionCard;