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
  Fab,
  IconNB,
  View,
  CheckBox
} from 'native-base';
import * as eventoActions from '../../../Redux/actions/eventoActions';
import * as rubrosEventoActions from '../../../Redux/actions/rubroEventoActions';
import styles from './styles';
import CompartirOrganizacion from '../CompartirEvento/CompartirOrganizacion';
import Immutable from 'seamless-immutable'

class MisEventos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verAntiguos: false
    }
    this.props.loadRubrosEvento();
    this.props.loadEventosOrganizacion();
  }

  getRubrosEvento() {
    return this.props.rubroEvento.rubrosEvento;
  }

  getONG() {
    return this.props.auth.user;
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

  sortEventos(eventos_unsorted) {
    let eventos = Immutable.asMutable(eventos_unsorted)
    return eventos.sort(function (a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
        keyB = new Date(b.fecha_hora_inicio);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
  }
  
  render() {
    let unsortedEventos = this.props.evento.eventos;
    let unfilteredEventos = this.sortEventos(unsortedEventos)
    const eventos = this.state.verAntiguos 
                    ? unfilteredEventos
                    : unfilteredEventos.filter(evento => moment(evento.fecha_hora_fin).format() > moment().format())
    const listaEventos = eventos.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button
            style={{ backgroundColor: '#ffe859' }}
            onPress={() => this.props.navigation.navigate('VerEvento', { evento: n.id })}
          >
            {
              n.campaña ?
              <Icon name="calendar" family="Entypo" /> :
              <Icon name="hand" />
            }
          </Button>
        </Left>
        <Body>
          <Text
            onPress={() => this.props.navigation.navigate('VerEvento', { evento: n.id })}
          >
            {n.nombre}
          </Text>
          <Text
            numberOfLines={1} note
            onPress={() => this.props.navigation.navigate('VerEvento', { evento: n.id })}
          >
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
            <Title>Mis actividades</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            {this.verEventosAntiguos()}
            {listaEventos}
          </Form>
          <CompartirOrganizacion ong={this.getONG()} />
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    loadEventosOrganizacion: () => dispatch(eventoActions.loadEventosOrganizacion()),
    loadRubrosEvento: () => dispatch(rubrosEventoActions.loadRubrosEvento()),
  };
}

const mapStateToProps = state => ({
  evento: state.evento,
  rubroEvento: state.rubroEvento,
  auth: state.auth,
});

export default connect(mapStateToProps, bindAction)(MisEventos);
