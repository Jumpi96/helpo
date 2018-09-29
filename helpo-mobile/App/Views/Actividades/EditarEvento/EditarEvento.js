import React from 'react';
import moment from 'moment';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Form,
  Icon,
  Text,
  Item,
  Picker,
  Label,
  Input,
  ListItem,
} from 'native-base';
import SelectorUbicacion from '../RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import SelectorFechaHora from '../RegistrarEvento/SelectorFechaHora/SelectorFechaHora';
import RegistrarContacto from '../RegistrarEvento/RegistrarContacto/RegistrarContacto';
import validateEmail from '../../../Lib/ValidateEmail';
import api from '../../../api';
import styles from './styles';

class EditarEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { evento, rubros } = params;
    let { contacto } = evento;
    for (let i = 0; i < contacto.length; i += 1) {
      contacto[i].contactId = i + 1;
    }
    this.state = {
      id: evento.id,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fecha_hora_inicio: moment(evento.fecha_hora_inicio),
      fecha_hora_fin: moment(evento.fecha_hora_fin),
      rubro_id: evento.rubro.id,
      ubicacion: evento.ubicacion,
      nextId: contacto.length + 1,
      errors: {},
      contacto,
      rubros
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
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


  handleSave() {
    if (this.handleValidation()) {
      const evento = {
        id: this.state.id,
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        contacto: this.getContactosInfo(),
      }
      this.updateEvento(evento);
    }
  }

  updateEvento(evento) {
    api.put('/actividades/eventos/' + evento.id + '/', evento)
      .then(res => {
        this.props.navigation.navigate('VerEvento', { evento, rubros: this.props.rubros });
      })
      .catch((error) => {
        if (error.response) { console.warn(error.response.status) }
        else { console.warn('Error: ', error.message) }
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
  }

  getContactosInfo() {
    const contactos = this.state.contacto;
    const infoContactos = [];
    // Si no hay contactos, retorno array vacio
    if (contactos.length === 0) {
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
    const contactos = this.state.contacto;
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
      if (contactos[i].email !== '' && !validateEmail(contactos[i].email)) {
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

  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }

  handleFechaHoraInicioChange(fechaHora) {
    this.setState({ fecha_hora_inicio: fechaHora, fecha_hora_fin: fechaHora });
  }

  handleFechaHoraFinChange(fechaHora) {
    this.setState({ fecha_hora_fin: fechaHora });
  }

  handleContactNombreChange(value, contactId) {
    const field = 'nombre';
    const index = this.state.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contacto;
    newContactos[index][field] = value;
    this.setState({ contacto: newContactos });
  }

  handleContactMailChange(value, contactId) {
    const field = 'email';
    const index = this.state.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contacto;
    newContactos[index][field] = value;
    this.setState({ contacto: newContactos })
  }

  handleContactTelefonoChange(value, contactId) {
    // Si value es No Numerico, no se modifica el estado
    if (isNaN(value)) {
      return;
    }
    const field = 'telefono';
    const index = this.state.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.contacto;
    newContactos[index][field] = value;
    this.setState({ contacto: newContactos });
  }

  addContact() {
    const newContact = {
      nombre: '',
      email: '',
      telefono: '',
      contactId: this.state.nextId,
    };
    const newContactos = this.state.contacto.concat(newContact);
    this.setState({
      contacto: newContactos,
      nextId: parseInt(this.state.nextId, 10) + 1,
    });
  }

  removeContact(id) {
    if (this.state.contacto.length === 1) {
      return;
    }
    const newContactos = this.state.contacto;
    const indexOfRemove = newContactos.map(e => e.contactId).indexOf(id);
    newContactos.splice(indexOfRemove, 1);
    this.setState({ contacto: newContactos });
  }

  render() {
    let listaRubroEventos = this.state.rubros.map((r) =>
      <Item value={r.id} key={r.id} label={r.nombre} />
    );
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Editar evento</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('RegistrarNecesidades', { id: this.state.id })}>
              <Text>Necesidades</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item>
              <Label>Nombre</Label>
              <Input
                value={this.state.nombre}
                onChangeText={(text) => this.setState({ nombre: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.nombre}</Text>
            <Item>
              <Label>Descripción</Label>
              <Input
                value={this.state.descripcion}
                onChangeText={(text) => this.setState({ descripcion: text })}
              />
            </Item>
            <ListItem>
              <Left>
                <Text>Rubro</Text>
              </Left>
              <Body>
                <Picker
                  note
                  mode="dropdown"
                  selectedValue={this.state.rubro_id}
                  onValueChange={this.handleRubroChange}
                >
                  {listaRubroEventos}
                </Picker>
              </Body>
            </ListItem>
            <Text style={styles.validationMessage}>{this.state.errors.rubro}</Text>
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
            <Text style={styles.validationMessage}>{this.state.errors.fechas}</Text>

            <ListItem>
              <Label>Ubicación</Label>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}
                onUbicacionChange={this.handleUbicacionChange}
              />
            </ListItem>

            <ListItem>
              <RegistrarContacto
                contactos={this.state.contacto}
                onNombreChange={this.handleContactNombreChange}
                onMailChange={this.handleContactMailChange}
                onTelefonoChange={this.handleContactTelefonoChange}
                onAddContact={this.addContact}
                onRemoveContact={this.removeContact}
              />
              <Text style={styles.validationMessage}>{this.state.errors.contactoNombre}</Text>
              <Text style={styles.validationMessage}>{this.state.errors.contactoContacto}</Text>
              <Text style={styles.validationMessage}>{this.state.errors.email}</Text>
            </ListItem>
            <Button
              block style={{ margin: 10 }}
              onPress={this.handleSave}
            >
              <Text>Guardar Evento</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default EditarEvento;
