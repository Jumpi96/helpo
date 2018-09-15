import React from 'react';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Icon,
  Text,
  ListItem,
  Separator,
  View
} from 'native-base';
import styles from './styles';

class VerPropuestaPatrocinador extends React.Component {

  constructor(props) {
    super(props);
    const { propuesta, evento } = this.props.navigation.state.params;
    this.state = { propuesta, evento };
    this.getUserId = this.getUserId.bind(this);
  }

  componentDidMount() {
    
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
    return this.state.propuesta.empresa.id;
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

  render() {
    const { evento, propuesta } = this.state;
    if (evento.nombre) {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('LaunchScreen')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{propuesta.empresa.nombre}</Title>
            </Body>
            <Right>
              {propuesta.aceptado === 0 &&
                <Button onPress={() => this.props.navigation.navigate('ResponderPropuesta', { propuesta: this.state.propuesta, evento: evento.id })}>
                  <Text>Responder</Text>
                </Button>
              }
            </Right>
          </Header>
          <Content>
            <View>
              {this.getListaNecesidades(evento)}
              {this.getListaVoluntarios(evento)}
            </View>
          </Content>
        </Container>
      );
    }
    return (<Text>Loading..</Text>)
  }
}

export default VerPropuestaPatrocinador;
