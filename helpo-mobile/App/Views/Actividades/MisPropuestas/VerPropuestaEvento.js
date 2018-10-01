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
  Badge,
  Content,
  Separator,
  ListItem,
  Icon,
  Text,
  Label,
  View,
} from 'native-base';
import styles from './styles';

class VerPropuestaEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    this.state = {
      evento
    }
    this.getBotonRedireccion = this.getBotonRedireccion.bind(this);
  }

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

  getCantidadVoluntarios(v) {
    let contador = 0;
    let userId = this.getUserId();
    v.participaciones.forEach((p) => {
      if (p.colaborador.id === userId) {
        contador += p.cantidad;
      };
    });
    return contador;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  getListaVoluntarios(evento) {
    let listaVoluntarios = [];
    let cantidad;
    evento.voluntarios.forEach((v) => {
      cantidad = this.getCantidadVoluntarios(v);
      if (cantidad > 0) {
        listaVoluntarios.push(
          <ListItem icon key={v.id}>
            <Left>
              <Button style={{ backgroundColor: '#ea8f3a' }}>
                <Icon active name="person" />
              </Button>
            </Left>
            <Body>
              <Text>
                {v.funcion.nombre}
              </Text>
              <Text numberOfLines={1} note>
                {v.descripcion}
              </Text>
            </Body>
            <Right>
              <Text>{cantidad}</Text>
            </Right>
          </ListItem>
        );
      }
    });
    if (listaVoluntarios.length > 0) {
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Voluntarios</Text>
          </Separator>
          {listaVoluntarios}
        </View>
      );
    }
    return undefined;
  }

  getPropuesta() {
    return this.state.evento.propuestas.filter(p => p.empresa.id === this.getUserId())[0];
  }

  getBotonEstado() {
    switch (this.getPropuesta().aceptado) {
      case 0:
        return (
          <Badge warning>
            <Text>Propuesta pendiente</Text>
          </Badge>
        );
      case 1:
        return (
          <Badge success>
            <Text>Propuesta aceptada</Text>
          </Badge>
        );
      case 2:
        return (
          <Badge danger>
            <Text>Propuesta rechazada</Text>
          </Badge>
        );
    }    
  }
  
  getBotonRedireccion() {
    const propuesta = this.getPropuesta();
    const { evento } = this.state;
    if (moment(evento.fecha_hora_inicio) < moment()) {
      if (propuesta.aceptado === 1) {
        return (
          <Button transparent onPress={() => this.props.navigation.navigate('ComentarEvento', { evento: evento.id })}>
            <Text>Comentar</Text>
          </Button>
        )
      }
    } else {
      if (propuesta.aceptado === 0) {
        return (
          <Button transparent onPress={() => this.props.navigation.navigate('RegistrarOfrecimiento', { evento: evento.id })}>
            <Text>Modificar</Text>
          </Button>
        )
      }
    }
    return undefined;
  }

  getComentario(propuesta) {
    if (propuesta.comentario !== null) {
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Comentario de la ONG</Text>
          </Separator>
          <ListItem>
            <Text>{propuesta.comentario}</Text>
          </ListItem>
        </View>
      )
    }
    return undefined;
  }

  render() {
    const evento = this.state.evento;
    const propuesta = this.getPropuesta();
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisPropuestas')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title></Title>
          </Body>
          <Right>
            {this.getBotonRedireccion()}
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
            <Label style={styles.label}>Estado</Label>
            {this.getBotonEstado()}
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Fecha</Label>
            <Text>{moment(propuesta.created).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          {this.getListaNecesidades(evento)}
          {this.getListaVoluntarios(evento)}
          {propuesta.aceptado === -1 ?
            this.getComentario(propuesta) : undefined
          }
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(VerPropuestaEvento);
