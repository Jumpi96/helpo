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
import * as eventoActions from '../../../Redux/actions/eventoActions';
import validateEmail from '../../../Lib/ValidateEmail';
import styles from './styles';

class EditarEvento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    for (let i = 0; i < evento.contacto.length; i += 1) {
      evento.contacto[i].contactId = i + 1;
    }
    evento.nextId = evento.contacto.length + 1;
    evento.rubro_id = evento.rubro.id;
    this.state = {
      evento,
      errors: {},
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleDescripcionChange = this.handleDescripcionChange.bind(this);
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
      const evento = this.state.evento;
      this.props.updateEvento(evento);
      this.props.navigation.navigate('VerEvento', { evento, rubros: this.props.rubros });
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.state.evento.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    }

    if (isNaN(Date.parse(this.state.evento.fecha_hora_inicio)) ||
        isNaN(Date.parse(this.state.evento.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas.';
    } else {
      const inicio = moment(this.state.evento.fecha_hora_inicio);
      const fin = moment(this.state.evento.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          inicio < ahora ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = 'Las fecha de fin debe ser mayor a la de inicio y ' +
          'la actividad no durar más de 24 horas.';
      }
    }
    if (this.state.evento.rubro_id === 0) {
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
    const contactos = this.state.evento.contacto;
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

  handleNombreChange(text) {
    const evento = this.state.evento;
    evento.nombre = text;
    this.setState({ evento });
  }

  handleDescripcionChange(text) {
    const evento = this.state.evento;
    evento.descripcion = text;
    this.setState({ evento });
  }

  handleUbicacionChange(ubi) {
    const evento = this.state.evento;
    evento.ubicacion = ubi;
    this.setState({ evento });
  }

  handleRubroChange(r) {
    const evento = this.state.evento;
    evento.rubro_id = r;
    this.setState({ evento });
  }

  handleFechaHoraInicioChange(fechaHora) {
    const evento = this.state.evento;
    evento.fecha_hora_inicio = fechaHora;
    evento.fecha_hora_fin = fechaHora;
    this.setState({ evento });
  }

  handleFechaHoraFinChange(fechaHora) {
    const evento = this.state.evento;
    evento.fecha_hora_fin = fechaHora;
    this.setState({ evento });
  }

  handleContactNombreChange(value, contactId) {
    const field = 'nombre';
    const index = this.state.evento.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.evento.contacto;
    newContactos[index][field] = value;
    const evento = this.state.evento;
    evento.contacto = newContactos;
    this.setState({ evento });
  }

  handleContactMailChange(value, contactId) {
    const field = 'email';
    const index = this.state.evento.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.evento.contacto;
    newContactos[index][field] = value;
    const evento = this.state.evento;
    evento.contacto = newContactos;
    this.setState({ evento });
  }

  handleContactTelefonoChange(value, contactId) {
    // Si value es No Numerico, no se modifica el estado
    if (isNaN(value)) {
      return;
    }
    const field = 'telefono';
    const index = this.state.evento.contacto.map(e => e.contactId).indexOf(contactId);
    const newContactos = this.state.evento.contacto;
    newContactos[index][field] = value;
    const evento = this.state.evento;
    evento.contacto = newContactos;
    this.setState({ evento });
  }

  addContact() {
    const newContact = {
      nombre: '',
      email: '',
      telefono: '',
      contactId: this.state.evento.nextId,
    };
    const newContactos = this.state.evento.contacto.concat(newContact);
    const evento = this.state.evento;
    evento.contacto = newContactos;
    this.setState({
      evento,
      nextId: parseInt(this.state.evento.nextId, 10) + 1,
    });
  }

  removeContact(id) {
    if (this.state.evento.contacto.length === 1) {
      return;
    }
    const newContactos = this.state.evento.contacto;
    const indexOfRemove = newContactos.map(e => e.contactId).indexOf(id);
    newContactos.splice(indexOfRemove, 1);
    const evento = this.state.evento;
    evento.contacto = newContactos;
    this.setState({ evento });
  }

  render() {
    const { params } = this.props.navigation.state;
    const rubros = params.rubros;
    let listaRubroEventos = rubros.map((r) =>
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
            <Title>Editar actividad</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('RegistrarNecesidades',{ id: this.state.evento.id })}>
              <Text>Necesidades</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item>
              <Label>Nombre</Label>
              <Input
                value={this.state.evento.nombre}
                onChangeText={this.handleNombreChange}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.nombre}</Text>
            <Item>
              <Label>Descripción</Label>
              <Input
                value={this.state.evento.descripcion}
                onChangeText={this.handleDescripcionChange}
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
                  selectedValue={this.state.evento.rubro_id}
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
              value={this.state.evento.fecha_hora_inicio}
              handleChange={this.handleFechaHoraInicioChange}
            />
            <SelectorFechaHora
              detalle="Fin"
              soloFecha={false}
              value={this.state.evento.fecha_hora_fin}
              handleChange={this.handleFechaHoraFinChange}
            />
            <Text style={styles.validationMessage}>{this.state.errors.fechas}</Text>

            <ListItem>
              <Label>Ubicación</Label>
              <SelectorUbicacion
                ubicacion={this.state.evento.ubicacion}
                onUbicacionChange={this.handleUbicacionChange}
              />
            </ListItem>

            <ListItem>
              <RegistrarContacto
                contactos={this.state.evento.contacto}
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
              block style={{ margin: 15, marginTop: 50 }}
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

function bindAction(dispatch) {
  return {
    updateEvento: evento => dispatch(eventoActions.updateEvento(evento)),
  };
}

export default connect(undefined, bindAction)(EditarEvento);
