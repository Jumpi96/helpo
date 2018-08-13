
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body } from 'native-base';
import * as eventoActions from '../../../Redux/actions/eventoActions';
import EventoCard from './EventoCard/EventoCard';
import styles from './styles';

class ConsultarEventos extends Component {

  constructor(props) {
    super(props);
    this.props.loadEventos();
  }

  render() {
    const eventos = this.props.evento.eventos;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("LaunchScreen")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Consultar eventos</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {eventos && eventos.map(evento =>
            <EventoCard
              key={evento.id}
              evento={evento}
              openEvento={() => this.props.navigation.navigate('ConsultarEvento', { evento: evento })}
            />
            )}
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    loadEventos: () => dispatch(eventoActions.loadEventosProximos()),
  };
}

const mapStateToProps = state => ({
  evento: state.evento,
});

export default connect(mapStateToProps, bindAction)(ConsultarEventos);
