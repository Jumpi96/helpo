import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Separator,
  ListItem,
  Icon,
  Text,
  Label,
  View,
} from 'native-base';
import { openDrawer } from '../../../actions/drawer';
import styles from './styles';

class ConsultaEvento extends React.Component {

  static propTypes = {
    evento: React.PropTypes.object,
  }

  getListaNecesidades() {
    return this.props.evento.necesidades.map(n =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: '#4286f4' }}>
            <Icon active name="archive" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.recurso.nombre} - {n.recurso.categoria.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{n.cantidad}</Text>
        </Right>
      </ListItem>
    );
  }

  getListaVoluntarios() {
    return this.props.evento.voluntarios.map(n =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: '#ea8f3a' }}>
            <Icon active name="person" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.funcion.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{n.cantidad}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    const evento = this.props.evento;
    let listaContactos;
    if (evento.contacto.length > 0) {
      listaContactos = evento.contacto.map(contacto =>
        <ListItem key={contacto.nombre}>
          <Text>{contacto.nombre} - {contacto.telefono}</Text>
        </ListItem>
      );
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{evento.nombre}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.registrarColaboraciones({ evento: evento.id })}>
              <Text>Colaborar</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Separator bordered noTopBorder>
            <Text>Información</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{evento.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Organización</Label>
            <Text>{evento.organizacion.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Descripción</Label>
            <Text>{evento.descripcion}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Rubro</Label>
            <Text>{evento.rubro.nombre}</Text>
          </ListItem>
          <Separator bordered noTopBorder>
            <Text>Fecha</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Inicio</Label>
            <Text>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Fin</Label>
            <Text>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          {listaContactos ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Contactos</Text>
              </Separator>
              {listaContactos}
            </View>
            ) : undefined
          }
          {evento.necesidades.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Necesidades materiales</Text>
              </Separator>
              {this.getListaNecesidades()}
            </View>
            ) : undefined
          }
          {evento.voluntarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Voluntarios</Text>
              </Separator>
              {this.getListaVoluntarios()}
            </View>
            ) : undefined
          }
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key))
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(ConsultaEvento);
