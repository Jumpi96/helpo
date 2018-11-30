
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, ListItem, Label, Header, Title, View, Content, Button, Icon, Left, Right, Body, Toast, Spinner } from 'native-base';
import api from '../../../api';
import EventoCard from './EventoCard/EventoCard';
import styles from './styles';

class ConsultarEventos extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventos: [],
      isLoading: true
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params && 
      (this.isParamNotEmpty(params.organizacion) || this.isParamNotEmpty(params.link))) {
      if (params.organizacion != '') {
        this.loadEventos('?organizacion=' + params.organizacion);
      } else {
        this.loadEventos(params.link);
      }
    } else {
      this.loadEventos('');
    }
  }

  isParamNotEmpty(param) {
    return param && param !== '';
  }

  loadEventos(ruta) {
    api.get('/actividades/consulta_eventos/' + ruta)
      .then((res) => {
        this.setState({ eventos: res.data, isLoading: false });
        if (res.data.length === 0) {
          Toast.show({
            text: 'No existen eventos registrados.',
            buttonText: 'Aceptar'
          });
        }
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  goToEvento(evento) {
    const { params } = this.props.navigation.state;
    const eventoParams = (params && (params.organizacion !== '' || params.link !== '')) ? 
      {
        evento,
        link: params.link,
        organizacion: params.organizacion,  
      } : { evento };
    this.props.navigation.navigate('ConsultarEvento', eventoParams);
  }

  getEventos(eventos) {
    if (eventos.length > 0) {
      if (eventos.length <= 3) {
        return (
          <View>
            {this.props.verAntiguas ? null : (
            <ListItem itemDivider>
              <Label style={styles.label}>Recomendaciones para vos</Label>
            </ListItem>)}
            {eventos.map(evento =>
              <EventoCard
                key={evento.id}
                evento={evento}
                openEvento={() => this.goToEvento(evento)}
              />
            )}
          </View>
        )
      } else {
        return (
          <View>
            {this.props.verAntiguas ? null : (
            <ListItem itemDivider>
              <Label style={styles.label}>Recomendaciones para vos</Label>
            </ListItem>)}
            {eventos.slice(0, 3).map(evento =>
              <EventoCard
                key={evento.id}
                evento={evento}
                openEvento={() => this.goToEvento(evento)}
              />
            )}
            {this.props.verAntiguas ? null : (
            <ListItem itemDivider>
              <Label style={styles.label}>Otras actividades sociales</Label>
            </ListItem>)}
            {eventos.slice(3).map(evento =>
              <EventoCard
                key={evento.id}
                evento={evento}
                openEvento={() => this.goToEvento(evento)}
              />
            )}
          </View>
        )
      }
    } else if(this.state.isLoading) {
      return (
        <Spinner color='red' />
      )
    }
  }

  render() {
    const eventos = this.state.eventos;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("LaunchScreen")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Actividades</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("FiltroEventos")}>
              <Icon type="FontAwesome" name="filter" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {this.getEventos(eventos)}
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = state => ({
  verAntiguas: state.filtroActividades.verAntiguas
})

export default connect(mapDispatchToProps)(ConsultarEventos);
