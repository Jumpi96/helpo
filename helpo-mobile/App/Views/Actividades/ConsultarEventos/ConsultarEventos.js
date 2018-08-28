
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body } from 'native-base';
import api from '../../../api';
import EventoCard from './EventoCard/EventoCard';
import styles from './styles';

class ConsultarEventos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventos: []
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params) {
      if (params.organizacion) {
        this.loadEventos('?organizacion=' + params.organizacion);
        params.organizacion = '';
      } else {
        this.loadEventos(params.link);
        params.link = '';
      }
    } else {
      this.loadEventos('');
    }
  }

  loadEventos(ruta) {
    api.get('/actividades/consulta_eventos/' + ruta)
      .then((res) => {
        this.setState({ eventos: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render() {
    const eventos = this.state.eventos;
    const { params } = this.props.navigation.state;
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
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("FiltroEventos")}>
              <Icon type="FontAwesome" name="filter" />
            </Button>
          </Right>
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

export default ConsultarEventos;
