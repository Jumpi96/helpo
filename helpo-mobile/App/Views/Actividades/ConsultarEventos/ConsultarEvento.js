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
} from 'native-base';
import styles from './styles';
import CompartirEvento from '../CompartirEvento/CompartirEvento';
import GoAlbum from '../AlbumEvento/GoAlbum'


class ConsultaEvento extends React.Component {

  constructor(props) {
    super(props);
    this.navigateColaborar = this.navigateColaborar.bind(this);
    this.togglePerfil = this.togglePerfil.bind(this);
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
    // TODO: Consultar perfil
    // this.props.navigation.navigate('ConsultarPerfilGenerico', { user_id: empresa });
    this.props.navigation.navigate('LaunchScreen');
  }

  getPropuestas(propuestas) {
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

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  render() {
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    let listaContactos;
    if (evento.contacto.length > 0) {
      listaContactos = evento.contacto.map(contacto =>
        <ListItem key={contacto.nombre}>
          <Text>{contacto.nombre} - {contacto.telefono}</Text>
        </ListItem>
      );
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('ConsultarEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{evento.nombre}</Title>
          </Body>
          {this.props.auth.user.user_type > 1 ?
            <Right>
              <Button
                transparent
                onPress={() => this.navigateColaborar(evento)}>
                <Text>Colaborar</Text>
              </Button>
            </Right> : undefined
          }
        </Header>
        <Content>
          <Separator bordered noTopBorder>
            <Text>Información</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{evento.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Organización</Label>
            <Text>{evento.organizacion.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Descripción</Label>
            <Text>{evento.descripcion}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Rubro</Label>
            <Text>{evento.rubro.nombre}</Text>
          </ListItem>
          <Separator bordered noTopBorder>
            <Text>Fecha</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Inicio</Label>
            <Text>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Fin</Label>
            <Text>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          {listaContactos ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Contactos</Text>
              </Separator>
              {listaContactos}
            </View>
          ) : undefined
          }
          {evento.necesidades.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Necesidades materiales</Text>
              </Separator>
              {this.getListaNecesidades(evento)}
            </View>
          ) : undefined
          }
          {evento.propuestas.length > 0 && this.getPropuestas(evento.propuestas)}
          {evento.voluntarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Voluntarios</Text>
              </Separator>
              {this.getListaVoluntarios(evento)}
            </View>
          ) : undefined
          }
          {evento.comentarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Comentarios</Text>
              </Separator>
              {this.getListaComentarios(evento)}
            </View>
          ) : undefined
          }
          <GoAlbum
            visible={evento.estado >= 2 ? true : false} // Solo visible si evento comenzo o finalizo
            eventoId={evento.id}
            navigation={this.props.navigation}
          />
          <CompartirEvento evento={params.evento} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(ConsultaEvento);
