import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
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
import * as eventoActions from '../../../actions/eventoActions';
import * as rubrosEventoActions from '../../../actions/rubroEventoActions';
import { openDrawer } from '../../../actions/drawer';
import styles from './styles';

class MisEventos extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadRubrosEvento();
    this.props.loadEventosOrganizacion();
  }

  render() {
    const listaEventos = this.props.eventos.map((n) =>
        <ListItem icon key={n.id}>
          <Left>
            <Button
              style={{ backgroundColor: "#ffe859" }}
              onPress={() => Actions.verEvento({ evento: n })}
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
            <Button transparent onPress={() => Actions.pop()}>
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
        <View style={{ flex: 1 }}>
          <Fab
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#5067FF" }}
            position="bottomRight"
            onPress={() => Actions.registrarEvento()}
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
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    loadEventosOrganizacion: () => dispatch(eventoActions.loadEventosOrganizacion()),
    loadRubrosEvento: () => dispatch(rubrosEventoActions.loadRubrosEvento()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  eventos: state.eventos,
  rubrosEvento: state.rubrosEvento,
});

export default connect(mapStateToProps, bindAction)(MisEventos);
