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

class VerColaboracionesEvento extends React.Component {

  static propTypes = {
    evento: React.PropTypes.object,
  }

  getListaNecesidades() {
    const listaNecesidades = [];
    let cantidad;
    this.props.evento.necesidades.forEach((n) => {
      cantidad = this.getCantidadNecesidades(n);
      if (cantidad > 0) {
        listaNecesidades.push(
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
              <Text>{cantidad}</Text>
            </Right>
          </ListItem>
        );
      }
    });
    if (listaNecesidades.length > 0) {
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Necesidades</Text>
          </Separator>
          {listaNecesidades}
        </View>
      );
    }
    return undefined;
  }

  getFuncionVoluntario(voluntarios) {
    const userId = this.getUserId();
    for (let i = 0; i < voluntarios.length; i += 1) {
      if (voluntarios[i].participaciones.filter(p => p.voluntario_id === userId)) {
        return voluntarios[i];
      }
    }
    return undefined;
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    let userId = this.getUserId();
    n.colaboraciones.forEach((c) => {
      if (c.voluntario_id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  getListaVoluntarios() {
    const voluntario = this.getFuncionVoluntario(this.props.evento.voluntarios);
    if (voluntario) {
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Necesidades</Text>
          </Separator>
          <ListItem icon key={voluntario.id}>
            <Left>
              <Button style={{ backgroundColor: '#ea8f3a' }}>
                <Icon active name="person" />
              </Button>
            </Left>
            <Body>
              <Text>
                {voluntario.funcion.nombre}
              </Text>
              <Text numberOfLines={1} note>
                {voluntario.descripcion}
              </Text>
            </Body>
          </ListItem>
        </View>
      );
    }
    return undefined;
  }

  render() {
    const evento = this.props.evento;
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
          { moment(evento.fecha_hora_inicio) > moment() ?
            <Right>
              <Button transparent onPress={() => Actions.registrarColaboraciones({ evento: evento.id })}>
                <Text>Modificar</Text>
              </Button>
            </Right> : undefined
          }
        </Header>
        <Content>
          <Separator bordered noTopBorder>
            <Text>Información</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{evento.nombre}</Text>
          </ListItem>
          {this.getListaNecesidades()}
          {this.getListaVoluntarios()}
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
  auth: state.auth,
});

export default connect(mapStateToProps, bindAction)(VerColaboracionesEvento);
