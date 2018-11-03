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
  Label,
  Form,
  Text,
} from 'native-base';
import api from '../../../api';
import styles from './styles';


class NuevoMensaje extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    this.state = {
      evento,
      asunto: '',
      mensaje: '',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const mensaje = {
      mensaje: this.state.mensaje,
      asunto: this.state.asunto,
      evento_id: this.state.evento,
    }
    api.post('/actividades/mensajes/', mensaje)
      .then((res) => {
        this.props.navigation.navigate('VerEvento', { evento: this.state.evento })
      })
      .catch((e) => {
        this.setState({ error: "El mensaje ingresado no es válido." })
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Nuevo mensaje</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Asunto</Label>
              <Input value={this.state.asunto}
                onChangeText={(text) => this.setState({ asunto: text })} />
            </Item>
            <Item floatingLabel>
              <Label>Mensaje</Label>
              <Input value={this.state.mensaje} multiline
                onChangeText={(text) => this.setState({ mensaje: text })} />
            </Item>
            <Button block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}>
              <Text>Enviar mensaje</Text>
            </Button>
            <Text style={styles.validationMessage}>{this.state.error}</Text>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default NuevoMensaje;
