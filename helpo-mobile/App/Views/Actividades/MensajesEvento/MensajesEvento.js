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
import moment from 'moment';
import './styles';
import api from '../../../api';


class MensajesEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    this.state = {
      evento,
      mensajes: []
    }
    this.loadMensajes = this.loadMensajes.bind(this);
    this.getMensajes = this.getMensajes.bind(this);
  }

  componentDidMount() {
    this.loadMensajes();
  }

  loadMensajes() {
    api.get('/actividades/mensajes/?evento=' + this.state.evento)
      .then((res) => {
        this.setState({ mensajes: res.data });
      })
      .catch((e) => {
        this.props.history.push({ pathname: '/dashboard' });
      })
  }

  getMensajes() {
    if (this.state.mensajes.length > 0) {
      return this.state.mensajes.map((n) =>
        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "#ea8f3a" }}>
              <Icon type='EvilIcons' name='envelope'/>
            </Button>
          </Left>
          <Body>
            <Text>
              {moment(n.created).format("DD/MM/YYYY HH:mm")}
            </Text>
            <Text numberOfLines={1} note>
              {n.mensaje}
            </Text>
          </Body>
        </ListItem>
      );
    } else {
      return (
        <ListItem>
          <Body>
            <Text note>
              {'Este evento no tiene mensajes actualmente.'}
            </Text>
          </Body>
        </ListItem>
      )
    }
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
            <Title>Mensajes de evento</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate('NuevoMensaje', { evento: this.state.evento})}>
              <Icon type='Entypo' name='plus' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <ListItem>
              <Text>
                Los mensajes son enviados a todos los voluntarios registrados en el evento. Si un voluntario se anota posteriormente al envío del mensaje, también recibirá una copia del mismo.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                Una copia del mensaje será enviada a su correo electrónico.
              </Text>
            </ListItem>
            {this.getMensajes()}
          </Form>
        </Content>
      </Container>
    );
  }
}

export default MensajesEvento;
