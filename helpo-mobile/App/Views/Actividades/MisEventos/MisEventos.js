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
} from 'native-base';
import * as eventoActions from '../../../Redux/actions/eventoActions';
import * as rubrosEventoActions from '../../../Redux/actions/rubroEventoActions';
import styles from './styles';
import CompartirOrganizacion from '../CompartirEvento/CompartirOrganizacion';

class MisEventos extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventosOrganizacion();
  }

  getRubrosEvento() {
    return this.props.rubroEvento.rubrosEvento;
  }

  getONG() {
    return this.props.auth.user;
  }
  
  render() {
    const eventos = this.props.evento.eventos;
    const listaEventos = eventos.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button
            style={{ backgroundColor: '#ffe859' }}
            onPress={() => this.props.navigation.navigate('VerEvento', { evento: n.id })}
          >
            <Icon name="hand" />
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
            {listaEventos}
          </Form>
          <CompartirOrganizacion ong={this.getONG()} />
        </Content>
        <View style={{ flex: 0.1 }}>
          <Fab
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#E94E1B" }}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate('RegistrarEvento')}
          >
            <IconNB name="md-add" />
          </Fab>
        </View>
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
