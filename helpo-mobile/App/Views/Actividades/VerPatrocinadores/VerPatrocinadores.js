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
  Thumbnail,
  Icon,
  Text,
  ListItem,
  View,
  Spinner
} from 'native-base';
import api from '../../../api';
import styles from './styles';

class VerPatrocinadores extends React.Component {

  constructor(props) {
    super(props);
    const { evento } = this.props.navigation.state.params;
    this.state = {
      evento: { id: evento },
    };
    this.loadEvento = this.loadEvento.bind(this);
    this.togglePropuesta = this.togglePropuesta.bind(this);
  }

  componentDidMount() {
    this.loadEvento();
  }

  loadEvento() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
      .then(res => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  togglePropuesta(propuesta) {
    this.props.navigation.navigate('VerPropuestaPatrocinador', { propuesta, evento: this.state.evento });
  }

  getBotonEstado(propuesta) {
    let color;
    if (propuesta.aceptado === 0) {
      color = '#F9DA1B';
    } else if (propuesta.aceptado === 1) {
      color = '#34A34F';
    } else {
      color = '#FD3C2D';
    }
    return (
      <Button style={{ backgroundColor: color }}>
        <Icon></Icon>
      </Button>
    )
  }

  render() {
    const { evento } = this.state;
    if (evento.nombre) {
      let listaPropuestas = evento.propuestas.map((p) =>
        <ListItem thumbnail key={p.id} onPress={() => this.togglePropuesta(p)}>
          <Left>
            <Thumbnail small source={{ uri: p.empresa.avatar }} />
          </Left>
          <Body>
            <Text>
              {p.empresa.nombre}
            </Text>
          </Body>
          <Right>
            {this.getBotonEstado(p)}
          </Right>
        </ListItem>
      );
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('LaunchScreen')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{evento.nombre}</Title>
            </Body>
          </Header>
          <Content>
            <View>{listaPropuestas}</View>
          </Content>
        </Container>
      );
    }
    return (<Spinner color='red' />)
  }
}

export default VerPatrocinadores;
