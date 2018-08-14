import React from 'react';
import { Alert } from 'react-native';
//import { FormValidationMessage } from 'react-native-elements';
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
  Right,
  Icon,
  Form,
  Text,
} from 'native-base';
import moment from 'moment';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import api from '../../../api';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';
import RegistrarContacto from './RegistrarContacto/RegistrarContacto';
import validateEmail from '../../../Lib/ValidateEmail';
import styles from './styles';

class RegistrarEvento extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      descripcion: '',
      rubro_id: 0,
      fecha_hora_inicio: new Date(),
      fecha_hora_fin: new Date(),
        // TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      contactos: [{
        nombre: '',
        mail: '',
        telefono: '',
        contactId: 1,
      }],
      nextId: 2,
      errors: {},
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    /* Metodos de contacto */
    this.handleContactNombreChange = this.handleContactNombreChange.bind(this);
    this.handleContactMailChange = this.handleContactMailChange.bind(this);
    this.handleContactTelefonoChange = this.handleContactTelefonoChange.bind(this);
    this.addContact = this.addContact.bind(this);
    this.removeContact = this.removeContact.bind(this);
    /* ------------------- */
  }


  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        contacto: this.getContactosInfo(),
      };
      api.post('/actividades/eventos/', evento)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          Alert.alert(
            'Registrar evento',
            'Se registró el evento con éxito.'
          );
          this.props.navigation.navigate('RegistrarNecesidades', { evento: evento.id });
        }).catch((error) => {
          if (error.response) { console.log(error.response); } else { console.log('Error: ', error.message); }
        });
    }
  }

  getContactosInfo() {
    const contactos = this.state.contactos;
    const infoContactos = [];
    // Si no hay contactos, retorno array vacio
    if (contactos[0].nombre === '') {
      return infoContactos;
    }
    for (let i = 0; i < contactos.length; i += 1) {
      const telefonoInfo = contactos[i].telefono !== '' ? contactos[i].telefono : null;
      const emailInfo = contactos[i].email !== '' ? contactos[i].email : null;

      const cto = {
        nombre: contactos[i].nombre,
        email: emailInfo,
        telefono: telefonoInfo,
      };
      infoContactos[i] = cto;
    }
    return infoContactos;
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
        isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas.';
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          inicio < ahora ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = 'Las fecha de fin debe ser mayor a la de inicio y ' +
          'la actividad no durar más de 24 horas.';
      }
    }
    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar los rubros.';
    }
    const contactValidation = this.validateContactos();
    const contactErrors = contactValidation.errors;
    if (!contactValidation.is_valid) {
      formIsValid = false;
    }
    // Concateno errors con contactErrors
    const allErrors = Object.assign({}, errors, contactErrors);
    this.setState({ errors: allErrors });
    return formIsValid;
  }
  // Devuelve True si no hay errores
  validateContactos() {
    const errors = { contactoNombre: '', contactoContacto: '', email: '' };
    const validacion = { is_valid: true, errors };
    const contactos = this.state.contactos;
    for (let i = 0; i < contactos.length; i += 1) {
      // Es valido no ingresar ningun contacto
      if (contactos[i].nombre === '' &&
      contactos[i].email === '' &&
      contactos[i].telefono === '' &&
      contactos.length === 1) {
        return validacion;
      }
      if (contactos[i].nombre === '') {
        errors.contactoNombre = 'No puede ingresar un contacto sin nombre';
        validacion.is_valid = false;
      }
      if (contactos[i].email === '' && contactos[i].telefono === '') {
        errors.contactoContacto = 'Debe ingresar un mail o un telefono';
        validacion.is_valid = false;
      }
      if (contactos[i].email !== '' && !(validateEmail(contactos[i].email))) {
        errors.email = 'Debe ingresar un mail valido';
        validacion.is_valid = false;
      }
    }
    validacion.errors = errors;
    return validacion;
  }

  handleUbicacionChange(ubi) {
    this.setState({ ubicacion: ubi });
  }

  handleFechaHoraInicioChange(f_h) {
    this.setState({ fecha_hora_inicio: f_h, fecha_hora_fin: f_h });
  }

  handleFechaHoraFinChange(f_h) {
    this.setState({ fecha_hora_fin: f_h });
  }

  handleContactNombreChange(value, contactId) {
    const field = 'nombre';
    const index = this.state.contactos.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contactos;
    newContactos[index][field] = value;
    this.setState({
      contactos: newContactos,
    });
  }

  handleContactMailChange(value, contactId) {
    const field = 'email';
    const index = this.state.contactos.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contactos;
    newContactos[index][field] = value;
    this.setState({
      contactos: newContactos,
    });
  }

  handleContactTelefonoChange(value, contactId) {
    // Si value es No Numerico, no se modifica el estado
    if (isNaN(value)) {
      return;
    }
    const field = 'telefono';
    const index = this.state.contactos.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contactos;
    newContactos[index][field] = value;
    this.setState({
      contactos: newContactos,
    });
  }

  addContact() {
    const newContact = {
      nombre: '',
      email: '',
      telefono: '',
      contactId: this.state.nextId,
    };
    const newContactos = this.state.contactos.concat(newContact);
    this.setState({
      contactos: newContactos,
      nextId: parseInt(this.state.nextId, 10) + 1,
    });
  }

  removeContact(id) {
    if (this.state.contactos.length === 1) {
      return;
    }
    const newContactos = this.state.contactos;
    const indexOfRemove = newContactos.map(e => e.contactId).indexOf(id);
    newContactos.splice(indexOfRemove, 1);
    this.setState({
      contactos: newContactos,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("LaunchScreen")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Registrar evento</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Nombre</Label>
              <Input
                value={this.state.nombre}
                onChangeText={text => this.setState({ nombre: text })}
              />
            </Item>
            <Text>{this.state.errors.nombre}</Text>
            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input
                value={this.state.descripcion}
                onChangeText={text => this.setState({ descripcion: text })}
              />
            </Item>

            <ListaRubrosEvento
              name="listaRubros"
              rubro_id={this.state.rubro_id}
              onRubroChange={this.handleRubroChange}
            />
            <Text>{this.state.errors.rubro}</Text>

            <SelectorFechaHora
              detalle="Inicio"
              soloFecha={false}
              value={this.state.fecha_hora_inicio}
              handleChange={this.handleFechaHoraInicioChange}
            />
            <SelectorFechaHora
              detalle="Fin"
              soloFecha={false}
              value={this.state.fecha_hora_fin}
              handleChange={this.handleFechaHoraFinChange}
            />
            <Text>{this.state.errors.fechas}</Text>

            <Item>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}
                onUbicacionChange={this.handleUbicacionChange}
              />
            </Item>
            <Item>
              <RegistrarContacto
                contactos={this.state.contactos}
                onNombreChange={this.handleContactNombreChange}
                onMailChange={this.handleContactMailChange}
                onTelefonoChange={this.handleContactTelefonoChange}
                onAddContact={this.addContact}
                onRemoveContact={this.removeContact}
              />
            </Item>
            <Text>{this.state.errors.contactoNombre}</Text>
            <Text>{this.state.errors.contactoContacto}</Text>
            <Text>{this.state.errors.email}</Text>
            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}
            >
              <Text>Guardar Evento</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default RegistrarEvento;
