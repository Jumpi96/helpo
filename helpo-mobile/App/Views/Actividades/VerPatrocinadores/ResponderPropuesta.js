import React from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Input,
  Body,
  Left,
  Icon,
  ListItem,
  Label,
  Form,
  Text,
  Switch
} from 'native-base';
import api from '../../../api';
import styles from './styles';


class ResponderPropuesta extends React.Component {

  constructor(props) {
    super(props);
    const { propuesta, evento } = this.props.navigation.state.params;
    this.state = { propuesta, evento, respuesta: true }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const propuesta = this.state.propuesta;
    if (this.state.respuesta) {
      propuesta.aceptado = 1;
    } else {
      if (!this.state.mensaje) {
        return;
      }
      propuesta.aceptado = -1;
      propuesta.mensaje = this.state.mensaje;
    }
    api.put('/actividades/propuestas/' + propuesta.id + '/', propuesta)
      .then(() => {
        this.props.navigation.navigate('VerPatrocinadores', { evento: this.state.evento })
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('VerPatrocinadores', { evento: this.state.evento })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Responder propuesta</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <ListItem>
              <Switch value={this.state.respuesta} onValueChange={(val) => this.setState({ respuesta: val })} />
              <Label>{this.state.respuesta ? "Propuesta aceptada" : "Propuesta rechazada"}</Label>
            </ListItem>
            {!this.state.respuesta &&
              <ListItem>
                <Input value={this.state.mensaje} multiline numberOfLines={3}
                  placeholder="Debe completar un mensaje privado para rechazar la propuesta."
                  onChangeText={(text) => this.setState({ mensaje: text })} />
              </ListItem>
            }
            <Button block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}>
              <Text>Guardar respuesta</Text>
            </Button>
            <Text style={styles.validationMessage}>{this.state.error}</Text>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default ResponderPropuesta;
