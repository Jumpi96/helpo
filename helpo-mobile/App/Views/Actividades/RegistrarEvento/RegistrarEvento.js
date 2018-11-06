import React from 'react';
import { Alert } from 'react-native';
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
  Separator,
  Right,
  Icon,
  Form,
  Text,
  ListItem,
  Switch
} from 'native-base';
import moment from 'moment';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import api from '../../../api';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';
import RegistrarContacto from './RegistrarContacto/RegistrarContacto';
import validateEmail from '../../../Lib/ValidateEmail';
import SelectorHorarios from './SelectorHorarios/SelectorHorarios';
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
      contactos: [
      ],
      nextId: 1,
      errors: {},
      esEvento: true,
      horarios: [],
      submitting: false
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
    this.handleHorariosChange = this.handleHorariosChange.bind(this);
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
    this.setState({submitting: true});
    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        contacto: this.getContactosInfo(),
        campaña: !this.state.esEvento,
      };
      if (evento.campaña) { evento.horarios = this.state.horarios; }
      api.post('/actividades/eventos/', evento)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          Alert.alert(
            'Registrar actividad',
            'Se registró la actividad con éxito.'
          );
          this.props.navigation.navigate('RegistrarNecesidades', { id: res.data.id });
        }).catch((error) => {
          if (error.response) { console.log(error.response); } else { console.log('Error: ', error.message); }
          this.setState({submitting: false});
        });
    }
    this.setState({submitting: false});
  }

  getContactosInfo() {
    const contactos = this.state.contactos;
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
    const inicio = moment(this.state.fecha_hora_inicio);
    const fin = moment(this.state.fecha_hora_fin);
    const actual = moment(new Date());

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
      isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = 'Las fechas ingresadas no son válidas.';
    } else {
      if (inicio < actual) {
        formIsValid = false;
        errors.fechas = 'La fecha de inicio debe ser posterior a la fecha actual.';
      } else {
        if (fin <= inicio) {
          formIsValid = false;
          errors.fechas = 'La fecha de inicio debe ser anterior a la fecha de fin del evento.';
        } else {
          if (moment.duration(fin.diff(inicio)).asHours() > 24 && inicio < fin && this.state.esEvento) {
            formIsValid = false;
            errors.fechas = 'El evento no puede durar más de 24 horas.'
          }
          else { errors.fechas = undefined; }
        }
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
        errors.contactoContacto = 'Debe ingresar un mail o un teléfono';
        validacion.is_valid = false;
      }
      if (contactos[i].email !== '' && !(validateEmail(contactos[i].email))) {
        errors.email = 'Debe ingresar un mail válido';
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
    /*if (this.state.contactos.length === 1) {
      return;
    }*/
    const newContactos = this.state.contactos;
    const indexOfRemove = newContactos.map(e => e.contactId).indexOf(id);
    newContactos.splice(indexOfRemove, 1);
    this.setState({
      contactos: newContactos,
    });
  }

  getMensaje() {
    if (this.state.esEvento) {
      return (
        <Text>
          Un evento es una actividad que se realiza en un día y horario determinado.
          Voluntarios y empresas podrán aportar hasta el inicio del evento.
        </Text>
      );
    } else {
      return (
        <Text>
          Una campaña es una actividad que dura un período prolongado de tiempo.
          Voluntarios y empresas podrán aportar durante toda su duración.
        </Text>
      );
    }
  }

  handleHorariosChange(horarios) {
    this.setState({ horarios });
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
            <Title>Registrar actividad social</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <ListItem>
              {this.getMensaje()}
            </ListItem>
            <ListItem>
              <Switch value={this.state.esEvento} onValueChange={(val) => this.setState({ esEvento: val })} />
              <Label>{this.state.esEvento ? "Evento" : "Campaña"}</Label>
            </ListItem>
            <Item floatingLabel>
              <Label>Nombre</Label>
              <Input
                value={this.state.nombre}
                onChangeText={text => this.setState({ nombre: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.nombre}</Text>
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
            {!this.state.esEvento ?
              <SelectorHorarios
                horarios={this.state.horarios}
                onHorariosChange={this.handleHorariosChange}
              />
              : undefined
            }
            <Item>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}
                onUbicacionChange={this.handleUbicacionChange}
              />
            </Item>
            <Separator bordered noTopBorder>
              <Text>Contactos</Text>
            </Separator>
            <RegistrarContacto
              contactos={this.state.contactos}
              onNombreChange={this.handleContactNombreChange}
              onMailChange={this.handleContactMailChange}
              onTelefonoChange={this.handleContactTelefonoChange}
              onAddContact={this.addContact}
              onRemoveContact={this.removeContact}
            />

            <Text style={styles.validationMessage}>{this.state.errors.contactoNombre}</Text>
            <Text style={styles.validationMessage}>{this.state.errors.contactoContacto}</Text>
            <Text style={styles.validationMessage}>{this.state.errors.email}</Text>
            <Button
              block style={{ margin: 10 }}
              disabled={this.state.submitting}
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
