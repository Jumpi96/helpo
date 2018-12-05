import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Separator,
  ListItem,
  Icon,
  Text,
  Label,
  View,
  Thumbnail,
  Spinner
} from 'native-base';
import openMap from 'react-native-open-maps';
import styles from './styles';
import CompartirEvento from '../CompartirEvento/CompartirEvento';
import GoAlbum from '../AlbumEvento/GoAlbum'
import api from '../../../api';


class ConsultaEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    this.state = {
      evento: { id: evento }
    }
    this.navigateColaborar = this.navigateColaborar.bind(this);
    this.togglePerfil = this.togglePerfil.bind(this);
    this.puedeColaborar = this.puedeColaborar.bind(this);
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
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  getListaNecesidades(evento) {
    return evento.necesidades.map(n =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: '#F9DA1B' }}>
            <Icon active name="archive" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.recurso.nombre} - {n.recurso.categoria.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{n.cantidad}</Text>
        </Right>
      </ListItem>
    );
  }

  goToUbicacion(ubicacion) {
    openMap({
      query: ubicacion.latitud + ',' + ubicacion.longitud
    });
  }

  navigateColaborar(evento) {
    if (this.props.auth.user.user_type === 2) {
      this.props.navigation.navigate('RegistrarColaboraciones', { evento: evento.id })
    } else {
      this.props.navigation.navigate('RegistrarOfrecimiento', { evento: evento.id })
    }
  }

  getListaVoluntarios(evento) {
    return evento.voluntarios.map(n =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: '#ea8f3a' }}>
            <Icon active name="person" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.funcion.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{n.cantidad}</Text>
        </Right>
      </ListItem>
    );
  }

  getListaComentarios(evento) {
    return evento.comentarios.map(n =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: '#ea8f3a' }}>
            <Icon type="FontAwesome" name="comment" />
          </Button>
        </Left>
        <Body>
          <Text>
            {
              n.voluntario.apellido != null ?
                n.voluntario.nombre + ' ' + n.voluntario.apellido
                : n.voluntario.nombre
            }
          </Text>
          <Text numberOfLines={2} note>
            {n.comentario}
          </Text>
        </Body>
      </ListItem>
    );
  }

  togglePerfil(empresa) {
    this.props.navigation.navigate('ConsultarOtroPerfilGenerico', { user: empresa });
  }

  getPropuestas(propuestas) {
    if (propuestas.filter(p => p.aceptado === 1).length > 0) {
      const listaPropuestas = [];
      propuestas = this.shuffle(propuestas);
      propuestas.forEach((p) => {
        if (p.aceptado === 1) {
          listaPropuestas.push(
            <ListItem thumbnail key={p.id} onPress={() => this.togglePerfil(p.empresa.id)}>
              <Left>
                <Thumbnail small source={{ uri: p.empresa.avatar }} />
              </Left>
              <Body>
                <Text>
                  {p.empresa.nombre}
                </Text>
              </Body>
            </ListItem>
          );
        }
      })
      return (
        <View>
          <Separator bordered noTopBorder>
            <Text>Con la ayuda de</Text>
          </Separator>
          {listaPropuestas}
        </View>
      )
    }
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  puedeColaborar(evento) {
    const { user } = this.props.auth;
    if (!((moment(evento.fecha_hora_inicio) <= moment() && !evento.campaña) ||
      (evento.campaña && (moment(evento.fecha_hora_fin) <= moment())))) {
      if (user) {
        if (user.user_type == 2) {
          return true;
        } else if (user.user_type == 3) {
          const propuestas_rechazadas = evento.propuestas.filter(p => p.empresa.id === user.id && p.aceptado === -1);
          if (propuestas_rechazadas.length === 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getHorarios(evento) {
    if (evento.campaña && evento.horarios.length > 0) {
      const listaHorarios = [];
      evento.horarios.forEach((h) => {
        listaHorarios.push(
          <ListItem>
            <Text>{h[0] + ' ' + h[1] + '-' + h[2]}</Text>
          </ListItem>
        )
      })
      return (
        <View>
          <ListItem itemDivider>
            <Label style={styles.label}>Horarios de atención</Label>
          </ListItem>
          {listaHorarios}
        </View>
      );
    }
  }

  goBackToConsultarEventos() {
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate('ConsultarEventos', {
      evento: '',
      link: params.link,
      organizacion: params.organizacion
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const { evento } = this.state;
    if (evento.nombre) {
      let listaContactos;
      if (evento.contacto.length > 0) {
        listaContactos = evento.contacto.map(contacto =>
          <ListItem key={contacto.nombre}>
            <Text>{contacto.nombre} - {contacto.email} - {contacto.telefono}</Text>
          </ListItem>
        );
      }
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() => this.goBackToConsultarEventos()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{evento.nombre}</Title>
            </Body>
            {this.puedeColaborar(evento) ?
              <Right>
                <Button
                  transparent
                  onPress={() => this.navigateColaborar(evento)}>
                  <Text>{this.props.auth.user.user_type === 2 ? "Colaborar" : "Patrocinar"}</Text>
                </Button>
              </Right> : undefined
            }
          </Header>
          <Content>
            <ListItem itemDivider>
              <Label style={styles.label}>Nombre</Label>
            </ListItem>
            <ListItem>
              <Text>{evento.nombre}</Text>
            </ListItem>

            <ListItem itemDivider>
              <Label style={styles.label}>Organización</Label>
            </ListItem>
            <ListItem>
              <Text>{evento.organizacion.nombre}</Text>
            </ListItem>

            <ListItem itemDivider>
              <Label style={styles.label}>Descripción</Label>
            </ListItem>
            <ListItem>
              <Text>{evento.descripcion}</Text>
            </ListItem>

            <ListItem itemDivider>
              <Label style={styles.label}>Rubro</Label>
            </ListItem>
            <ListItem>
              <Text>{evento.rubro.nombre}</Text>
            </ListItem>

            <ListItem itemDivider>
              <Label style={styles.label}>Fecha</Label>
            </ListItem>
            <ListItem>
              <Text>{'Inicio: ' + moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</Text>
            </ListItem>
            <ListItem>
              <Text>{'Fin: ' + moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</Text>
            </ListItem>
            {this.getHorarios(evento)}
            <ListItem itemDivider>
              <Label style={styles.label}>Ubicación</Label>
            </ListItem>
            <Button block style={{ margin: 15, marginTop: 20 }}
              onPress={() => this.goToUbicacion(evento.ubicacion)}
            >
              <Text>Abrir ubicación</Text>
            </Button>
            <ListItem>
              <Text>{evento.ubicacion.notas}</Text>
            </ListItem>
            {listaContactos ? (
              <View>
                <ListItem itemDivider>
                  <Label style={styles.label}>Contactos</Label>
                </ListItem>
                {listaContactos}
              </View>
            ) : undefined
            }
            {evento.necesidades.length > 0 ? (
              <View>
                <ListItem itemDivider>
                  <Label style={styles.label}>Necesidades materiales</Label>
                </ListItem>
                {this.getListaNecesidades(evento)}
              </View>
            ) : undefined
            }
            {this.getPropuestas(evento.propuestas)}
            {evento.voluntarios.length > 0 ? (
              <View>
                <ListItem itemDivider>
                  <Label style={styles.label}>Voluntarios</Label>
                </ListItem>
                {this.getListaVoluntarios(evento)}
              </View>
            ) : undefined
            }
            {evento.comentarios.length > 0 ? (
              <View>
                <ListItem itemDivider>
                  <Label style={styles.label}>Comentarios</Label>
                </ListItem>
                {this.getListaComentarios(evento)}
              </View>
            ) : undefined
            }
            <GoAlbum
              visible={moment().format() > moment(evento.fecha_hora_inicio).format() ? true : false} // Solo visible si evento comenzo o finalizo
              eventoId={evento.id}
              navigation={this.props.navigation}
            />
            <CompartirEvento evento={params.evento} />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Actividades</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content padder>
            <Spinner color="red" />
          </Content>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(ConsultaEvento);
