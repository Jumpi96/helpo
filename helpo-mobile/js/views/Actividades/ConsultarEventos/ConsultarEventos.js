
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, IconNB } from 'native-base';
import { Actions } from 'react-native-router-flux';
import * as eventoActions from '../../../actions/eventoActions';
import EventoCard from './EventoCard/EventoCard';
import styles from '../styles';

const {
  popRoute,
} = actions;

class ConsultarEventos extends Component {

  constructor(props) {
    super(props);
    this.props.loadEventos();
  }

  static propTypes = {
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {
    const eventos = this.props.eventos;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Consultar eventos</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {eventos.map(evento =>
            <EventoCard
              evento={evento}
            />
            )}
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
    loadEventos: () => dispatch(eventoActions.loadEventosProximos()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  eventos: state.eventos,
});

export default connect(mapStateToProps, bindAction)(ConsultarEventos);
