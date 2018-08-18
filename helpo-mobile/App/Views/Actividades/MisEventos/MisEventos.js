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

class MisEventos extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventosOrganizacion();
  }

  getRubrosEvento() {
    return this.props.rubroEvento.rubrosEvento;
  }

  render() {
    const eventos = this.props.evento.eventos;
    const listaEventos = eventos.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button
            style={{ backgroundColor: '#ffe859' }}
            onPress={() => this.props.navigation.navigate('VerEvento', { evento: n, rubros: this.getRubrosEvento() })}
          >
            <Icon name="hand" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.nombre}
          </Text>
          <Text numberOfLines={1} note>
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
            <Title>Mis eventos</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            {listaEventos}
          </Form>
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
});

export default connect(mapStateToProps, bindAction)(MisEventos);
