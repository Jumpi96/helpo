import React from 'react';
import moment from 'moment';
import {
  Button,
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Separator,
  ListItem,
  Icon,
  Text,
  Label,
  Fab,
  IconNB,
  ActionSheet,
  Toast,
  View,
} from 'native-base';
import api from '../../../api';
import styles from './styles';
import CompartirEvento from '../CompartirEvento/CompartirEvento';
import GoAlbum from '../AlbumEvento/GoAlbum'

class VerEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { evento } = params;
    this.state = {
      evento: { id: evento },
      fabActive: false,
    };
  }

  componentDidMount() {
    api.get(`/actividades/eventos/${this.state.evento.id}/`)
      .then((res) => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        console.warn(error.message);
      })
  }

  handleConfirmDelete(evento, b) {
    if (b.text === 'Eliminar') {
      if (moment(evento.fecha_hora_inicio) > moment()) {
        api.delete("/actividades/eventos/" + evento.id + "/")
          .then((res) => {
            console.log(res);
            console.log(res.data);
            this.props.navigation.navigate('MisEventos');
          }).catch(function (error) {
            if (error.response) { console.log(error.response.status); }
            else { console.log('Error: ', error.message); }
            this.setState({ error: 'Hubo un problema al cargar su información.' });
          });
      } else {
        Toast.show({
          text: 'No se pueden eliminar eventos ya finalizados.',
          position: 'bottom',
          buttonText: 'OK',
        });
      }
    }
  }

  handleEdit(evento) {
    if (moment(evento.fecha_hora_inicio) > moment()) {
      this.props.navigation.navigate('EditarEvento', { evento });
    } else {
      Toast.show({
        text: 'No se pueden modificar eventos ya finalizados.',
        position: 'bottom',
        buttonText: 'OK',
      });
    }
  }

  handlePropuestas(evento) {
    if (moment(evento.fecha_hora_inicio) > moment()) {
      this.props.navigation.navigate('VerPatrocinadores', { evento: evento.id });
    } else {
      Toast.show({
        text: 'No se pueden modificar propuestas de un evento finalizado.',
        position: 'bottom',
        buttonText: 'OK',
      });
    }
  }

  render() {
    const { evento } = this.state;
    if (evento.nombre) {
      const deleteButtons = [
        { text: 'Eliminar', icon: 'trash', iconColor: '#fa213b' },
        { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
      ];
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
              <Button transparent onPress={() => this.props.navigation.navigate('MisEventos')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Evento - {evento.nombre}</Title>
            </Body>
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
            <Separator bordered noTopBorder>
              <Text>Administrar evento</Text>
            </Separator>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate('ConsultarColaboraciones', {
                eventoId: evento.id
              })}
            >
              <Body>
                <Text>Ver colaboraciones</Text>
              </Body>
            </ListItem>
            <GoAlbum
              visible={evento.estado >= 2 ? true : false} // Solo visible si evento comenzo o finalizo
              eventoId={evento.id}
              navigation={this.props.navigation}
            />
            <ListItem
              button
              onPress={() => this.props.navigation.navigate('MensajesEvento', {
                evento: evento.id
              })}
            >
              <Body>
                <Text>Mensajes de evento</Text>
              </Body>
            </ListItem>
            <CompartirEvento evento={evento} />
          </Content>
          <View style={{ flex: 0.1 }}>
            <Fab
              direction="left"
              containerStyle={{}}
              active={this.state.fabActive}
              style={{ backgroundColor: '#E94E1B' }}
              position="bottomRight"
              onPress={() => this.setState({ fabActive: !this.state.fabActive })}
            >
              <IconNB name="md-add" />
              <Button style={{ backgroundColor: '#F4BF42' }}
                onPress={() => { this.handleEdit(evento) }}
              >
                <Icon name="color-filter" />
              </Button>
              <Button style={{ backgroundColor: '#34A34F' }}
                onPress={() => { this.handlePropuestas(evento) }}
              >
                <Icon family="Entypo" name="briefcase" />
              </Button>
              <Button
                style={{ backgroundColor: '#FD3C2D' }}
                onPress={() => {
                  ActionSheet.show(
                    {
                      options: deleteButtons,
                      cancelButtonIndex: 1,
                      destructiveButtonIndex: 0,
                      title: '¿Está seguro que desea eliminar el evento?',
                    },
                    (buttonIndex) => {
                      this.handleConfirmDelete(evento, deleteButtons[buttonIndex]);
                    });
                }}
              >
                <Icon name="trash" />
              </Button>
            </Fab>
          </View>
        </Container>
      );
    } else { 
      return (<Text></Text>);
    }
  }
}

export default VerEvento;
