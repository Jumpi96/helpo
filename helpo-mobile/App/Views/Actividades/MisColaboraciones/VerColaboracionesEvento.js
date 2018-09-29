import React from 'react';
import { connect } from 'react-redux';
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
import styles from './styles';
import { goVerEvento } from '../../../Services/NavFunctions'

class VerColaboracionesEvento extends React.Component {

  getListaNecesidades(evento) {
    let listaNecesidades = [];
    let cantidad;
    evento.necesidades.forEach((n) => {
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
      if (voluntarios[i].participaciones.filter(p => p.colaborador.id === userId)) {
        return voluntarios[i];
      }
    }
    return undefined;
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    let userId = this.getUserId();
    n.colaboraciones.forEach((c) => {
      if (c.colaborador.id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  getListaVoluntarios(evento) {
    const voluntario = this.getFuncionVoluntario(evento.voluntarios);
    if (voluntario) {
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Voluntarios</Text>
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
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisColaboraciones')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{evento.nombre}</Title>
          </Body>
          <Right>
          { moment(evento.fecha_hora_inicio) > moment() ?
            <Button transparent onPress={() => this.props.navigation.navigate('RegistrarColaboraciones', { evento: evento.id })}>
              <Text>Modificar</Text>
            </Button> :
            <Button transparent onPress={() => this.props.navigation.navigate('ComentarEvento', { evento: evento.id })}>
              <Text>Comentar</Text>
            </Button>
          }
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
          <ListItem 
            button 
            onPress={() => goVerEvento(evento.id, this.props.navigation)}>
            <Body>
              <Text>Ver Evento</Text>
            </Body>
        </ListItem>
          {this.getListaNecesidades(evento)}
          {this.getListaVoluntarios(evento)}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(VerColaboracionesEvento);
