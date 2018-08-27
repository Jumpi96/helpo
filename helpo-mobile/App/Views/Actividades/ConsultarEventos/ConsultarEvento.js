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
} from 'native-base';
import styles from './styles';
import { Linking, Image, TouchableHighlight, View } from 'react-native'

class ConsultaEvento extends React.Component {

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
          {this.props.auth.user.user_type === 2 ?
            <Right>
              <Button
                transparent
                onPress={() => this.props.navigation.navigate('RegistrarColaboraciones', { evento: evento.id })}>
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
          {evento.voluntarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Voluntarios</Text>
              </Separator>
              {this.getListaVoluntarios(evento)}
            </View>
          ) : undefined
          }
          {
            // Hacia abajo, copiado y pegado de 'VerEvento.js' para compartir en Redes Sociales
          }
          <View>
            <Separator bordered noTopBorder>
              <Text>Compartir</Text>
            </Separator>
            <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
              <TouchableHighlight onPress={() => {
                // Facebook - Cambiar
                var url = "https://www.facebook.com/sharer/sharer.php?u=" +
                  "https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" + evento.id;
                Linking.openURL(url);
              }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../../Images/facebook.png')}
                />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {
                // Twitter - Cambiar
                var url = "http://twitter.com/share?text=Sumate%20a%20mi%20evento%20en%20Helpo%3A%20" +
                  evento.nombre + "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" +
                  evento.id + "&hashtags=Helpo";
                Linking.openURL(url);
              }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../../Images/twitter.png')}
                />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {
                // Google+ - Cambiar
                var url = "https://plus.google.com/share?url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" + evento.id;
                Linking.openURL(url);
              }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../../Images/google.jpg')}
                />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {
                // LinkedIn - Cambiar
                var url = "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Factividades%2Fevento%2F" +
                  evento.id + "&summary=Sumate%20a%20mi%20evento%20en%20Helpo%3A%20" + evento.nombre + "&source=Helpo";
                Linking.openURL(url);
              }}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../../../Images/linkedin.png')}
                />
              </TouchableHighlight>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(ConsultaEvento);
