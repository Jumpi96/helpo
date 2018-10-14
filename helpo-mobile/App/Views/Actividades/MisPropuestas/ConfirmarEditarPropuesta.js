import React from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  ListItem,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
} from 'native-base';
import './styles';
import api from '../../../api';


class ConfirmarEditarPropuesta extends React.Component {

  actualizarPropuesta(evento, propuesta) {
    let newPropuesta = Object.assign({}, propuesta);
    newPropuesta.aceptado = 0;
    api.put('/actividades/propuestas/' + newPropuesta.id + '/', newPropuesta)
      .then(() => {
        this.props.navigation.navigate('RegistrarOfrecimiento', { evento: evento.id });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })

  }

  render() {
    const { params } = this.props.navigation.state;
    const { evento, propuesta } = params;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('VerPropuestaEvento', { evento })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Editar propuesta aceptada</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <ListItem>
              <Text style={{ fontWeight: 'bold' }}>
                ¿Estás seguro que deseas editar tu propuesta?
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                Si lo confirmas, la propuesta volverá a un estado pendiente. Si la ONG no acepta
                  la nueva propuesta, se eliminirá el patrocinio.
              </Text>
            </ListItem>
            <Button block style={{ margin: 15 }} onPress={() => this.actualizarPropuesta(evento, propuesta)}><Text>Aceptar</Text></Button>
            <Button block style={{ margin: 15 }} onPress={() => this.props.navigation.navigate('VerPropuestaEvento', { evento })}><Text>Cancelar</Text></Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default ConfirmarEditarPropuesta;
