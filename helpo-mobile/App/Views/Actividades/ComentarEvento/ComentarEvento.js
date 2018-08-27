import React from "react";
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Icon,
  Form,
  Text,
  View
} from "native-base";
import styles from './styles';
import api from '../../../api';

class ComentarEvento extends React.Component {

  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    const { evento } = params;
    this.state = {
      evento: { id: evento },
      comentario: '',
    };
    this.handleRetroalimentacion = this.handleRetroalimentacion.bind(this);
    this.handleComentar = this.handleComentar.bind(this);
  }

  componentDidMount() {
    this.loadEvento();
  }

  loadEvento() {
    api.get('/actividades/consulta_eventos/' + this.state.evento.id + '/')
      .then(res => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  dioRetroalimentacion(evento, usuario) {
    const necesidades = evento.necesidades;
    const voluntarios = evento.voluntarios;
    let filtroNecesidades;
    for (let i=0; i < necesidades.length; i++) {
      filtroNecesidades = necesidades[i].colaboraciones.filter(c => c.voluntario.id === usuario);
      if (filtroNecesidades.length > 0 && filtroNecesidades[0].retroalimentacion) {
        return true;
      }
    }
    let filtroVoluntarios;
    for (let i=0; i < voluntarios.length; i++) {
      filtroVoluntarios = voluntarios[i].participaciones.filter(c => c.voluntario.id === usuario);
      if (filtroVoluntarios.length > 0 && filtroVoluntarios[0].retroalimentacion) {
        return true;
      }
    }
    return false;
  }

  getOpcionRetroalimentacion() {
    if (!this.dioRetroalimentacion(this.state.evento, this.getUserId())) {
      return (
        <Button warning block style={{ margin: 15, marginTop: 20 }}
          onPress={this.handleRetroalimentacion}>
          <Text>¿Te gustó este evento?</Text>
        </Button>
      )
    } else {
      return (
        <Button block warning style={{ margin: 15, marginTop: 20 }}>
          <Text>Indicaste que te gustó el evento.</Text>
        </Button>
      );
    }
  }

  handleComentar() {
    const comentario = {
      comentario: this.state.comentario,
      evento_id: this.state.evento.id,
      voluntario_id: this.getUserId()
    }
    api.post('feedbacks/comentarios/', comentario)
      .then((res) => {
        this.props.navigation.navigate('ConsultarEvento', { evento: this.state.evento });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  handleRetroalimentacion() {
    api.post('feedbacks/retroalimentacion/', { evento: this.state.evento.id })
      .then((res) => {
        this.loadEvento();
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  getOpcionComentar() {
    if (this.existeComentario(this.getUserId())) {
      this.props.navigation.navigate('ConsultarEvento', { evento: this.state.evento });
    }
    return (
      <View>
        <Item floatingLabel>
          <Label>Comentario</Label>
          <Input value={this.state.comentario}
            onChangeText={(text) => this.setState({comentario: text})}/>
        </Item>
        <Text style={styles.validationMessage}>{this.state.error}</Text>
        <Button block style={{ margin: 15, marginTop: 20 }}
          onPress={this.handleComentar}>
            <Text>Guardar comentario</Text>
        </Button>
      </View>
    )
  }

  existeComentario(usuario) {
    return this.state.evento.comentarios.filter(c => c.voluntario.id === usuario).length > 0;
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  render(){
    if (this.state.evento.nombre) {
        return (
            <Container>
              <Header>
                <Left>
                  <Button transparent onPress={() => this.props.navigation.navigate('MisColaboraciones')}>
                    <Icon name="arrow-back" />
                  </Button>
                </Left>
                <Body>
                  <Title>{this.state.evento.nombre}</Title>
                </Body>
              </Header>
              <Content>
                <Form>
                  {this.getOpcionRetroalimentacion()}
                  {this.getOpcionComentar()}
                </Form>
              </Content>
            </Container>
          );
    }
    return (
        <Container>
            <Content>
                <Text>Cargando...</Text>
            </Content>
        </Container>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});
  
export default connect(mapStateToProps, undefined)(ComentarEvento);
  