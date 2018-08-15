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
  View,
  Fab,
  IconNB,
  ActionSheet,
  Toast,
} from 'native-base';
import api from '../../../api';
import styles from './styles';

class VerEvento extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fabActive: false,
    };
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
            if (error.response){ console.log(error.response.status); }
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
      const { params } = this.props.navigation.state;
      const rubros = params.rubros;
      this.props.navigation.navigate('EditarEvento', { evento, rubros });
    } else {
      Toast.show({
        text: 'No se pueden modificar eventos ya finalizados.',
        position: 'bottom',
        buttonText: 'OK',
      });
    }
  }

  render() {
    const deleteButtons = [
      { text: 'Eliminar', icon: 'trash', iconColor: '#fa213b' },
      { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
    ];
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
            <Button style={{ backgroundColor: '#34A34F' }}
              onPress={() => {this.handleEdit(evento)}}
            >
              <Icon name="color-filter" />
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
  }
}

export default VerEvento;