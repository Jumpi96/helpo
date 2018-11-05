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
  Form,
  Icon,
  Text,
  ListItem,
  CheckBox
} from 'native-base';
import * as eventoActions from '../../../Redux/actions/eventoActions';
import styles from './styles';

class MisColaboraciones extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadEventosConColaboraciones();
    this.state = {
      verAntiguos: false
    }
  }

  handleChangeVerAntiguos = () => {
    const verAntiguos = !this.state.verAntiguos
    this.setState({verAntiguos: verAntiguos})
  }

  verEventosAntiguos = () => (
    <ListItem>
      <CheckBox 
        checked={this.state.verAntiguos} 
        onPress={this.handleChangeVerAntiguos}
        color='orange'
      />
      <Body>
        <Text>¿Ver actividades finalizadas?</Text>
      </Body>
    </ListItem>
  )

  render() {
    const unfilteredEventos = this.props.evento.eventos;
    const eventos = this.state.verAntiguos 
                    ? unfilteredEventos
                    : unfilteredEventos.filter(evento => moment(evento.fecha_hora_fin).format() > moment().format())
    const listaEventos = eventos.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button
            style={{ backgroundColor: '#ffe859' }}
            onPress={() => this.props.navigation.navigate('VerColaboracionesEvento', { evento: n })}
          >
            {
              n.campaña ?
              <Icon name="calendar" family="Entypo" /> :
              <Icon name="hand" />
            }
          </Button>
        </Left>
        <Body>
          <Text onPress={() => this.props.navigation.navigate('VerColaboracionesEvento', { evento: n })}>
            {n.nombre}
          </Text>
          <Text numberOfLines={1} note onPress={() => this.props.navigation.navigate('VerColaboracionesEvento', { evento: n })}>
            {moment(n.fecha_hora_inicio).format('DD/MM/YYYY')}
          </Text>
        </Body>
        <Right>
          <Text>{n.rubro_id}</Text>
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
            <Title>Mis colaboraciones</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            {this.verEventosAntiguos()}
            {listaEventos}
          </Form>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    loadEventosConColaboraciones: () => dispatch(eventoActions.loadEventosConColaboraciones()),
  };
}

const mapStateToProps = state => ({
  evento: state.evento,
});

export default connect(mapStateToProps, bindAction)(MisColaboraciones);
