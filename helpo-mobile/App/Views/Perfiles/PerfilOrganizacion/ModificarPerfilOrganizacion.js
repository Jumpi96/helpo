import React, { Component } from 'react';
import api from '../../../api';
import ImagePicker from 'react-native-image-picker';
import { handleImageUpload } from '../../../Services/Imagen';
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
  ListItem,
  Picker,
  Thumbnail,
  Separator
} from 'native-base';
import styles from './styles'

class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organizacion: undefined,
      errors: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRubro = this.handleChangeRubro.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addImagen = this.addImagen.bind(this);
    this.prepareData = this.prepareData.bind(this);
  }

  async addImagen() {
    // Llamo al imagePicker y hago todo el procesamiento de cargar una imagen
    //Options for the image picker
    const options = {
      title: 'Seleccionar Imagen',
    };
    this.setState({ uploadingImage: true })
    ImagePicker.showImagePicker(options, async (response) => {
      // Paso la data de la imagen a Imagen para subirla a imgur
      const url = await handleImageUpload(response.data);
      this.setState({ new_avatar: url, uploadingImage: false })
    })
  }

  componentDidMount() {
    let organizacion = {};
    let rubrosOrganizacion = undefined;
    api.get('/auth/user/')
      .then(res => {
        organizacion.nombre = res.data.nombre;
        organizacion.apellido = res.data.apellido;
        const tipo = res.data.user_type === 3 ? 'perfil_empresa' : 'perfil_organizacion';
        return api.get(`/perfiles/${tipo}/${res.data.id}/`)
      })
      .then(res => {
        organizacion = Object.assign(organizacion, res.data);
        return api.get('/perfiles/rubros_organizacion/')
      })
      .then(res => {
        rubrosOrganizacion = res.data;
        return api.get('/perfiles/rubros_empresa/')
      })
      .then(res => {
        this.setState({
          organizacion,
          rubros: rubrosOrganizacion,
          rubrosEmpresa: res.data
        });
      });
  }

  handleChange(item, text) {
    const { organizacion } = this.state;
    organizacion[item] = text;
    this.setState({ organizacion });
  }

  handleChangeRubro(value) {
    const { organizacion } = this.state;
    if (organizacion.rubro !== null) {
      organizacion.rubro.id = value;
    }
    else {
      organizacion.usuario.user_type === 3 ?
        organizacion.rubro = { id: value, nombre: this.state.rubrosEmpresa[value].nombre } :
        organizacion.rubro = { id: value, nombre: this.state.rubros[value].nombre }
    }
    this.setState({ organizacion });
  }

  handleSubmit() {
    const organizacion = this.prepareData(this.state.organizacion);
    const { new_avatar } = this.state;
    if (new_avatar) {
      organizacion.avatar = { url: new_avatar };
    }
    const tipo = this.state.organizacion.usuario.user_type === 3 ? 'perfil_empresa' : 'perfil_organizacion';
    if (this.handleValidation()) {
      api.put(`/perfiles/${tipo}/${this.state.organizacion.usuario.id}/`, organizacion)
        .then((res) => {
          this.props.navigation.navigate('ConsultarPerfilGenerico');
        })
        .catch((e) => { console.log(e.response) })
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;
    const { organizacion } = this.state;

    if (isNaN(organizacion.cuit)) {
      formIsValid = false;
      errors.cuit = 'Debe ingresar un CUIT válido.';
    } else { errors.cuit = undefined; }

    if (isNaN(organizacion.telefono)) {
      formIsValid = false;
      errors.telefono = 'Debe ingresar un teléfono válido.';
    } else { errors.telefono = undefined; }

    this.setState({ errors: errors });
    return formIsValid;
  }

  getRubros() {
    if (this.state.organizacion.usuario.user_type === 3) {
      return this.state.rubrosEmpresa.map((r) =>
        <Picker.Item label={r.nombre} value={r.id}></Picker.Item>
      );
    } else {
      return this.state.rubros.map((r) =>
        <Picker.Item label={r.nombre} value={r.id}></Picker.Item>
      );
    };
  }

  prepareData(perfil) {
    const nuevo_perfil = { descripcion: perfil.descripcion };
    if (perfil.cuit !== null) {
      nuevo_perfil.cuit = perfil.cuit;
    }
    if (perfil.descripcion !== null) {
      nuevo_perfil.descripcion = perfil.descripcion;
    }
    if (perfil.rubro !== null && perfil.rubro !== 0) {
      const rubroId = perfil.rubro.id - 1;
      if (rubroId !== -1) {
        perfil.usuario.user_type === 3 ?
          nuevo_perfil.rubro = { id: rubroId, nombre: this.state.rubrosEmpresa[rubroId].nombre } :
          nuevo_perfil.rubro = { id: rubroId, nombre: this.state.rubros[rubroId].nombre }
      }
    }
    if (perfil.telefono !== null) {
      nuevo_perfil.telefono = perfil.telefono;
    }
    if (perfil.ubicacion !== null) {
      nuevo_perfil.ubicacion = perfil.ubicacion;
    }
    return nuevo_perfil;
  }

  render() {
    if (this.state.organizacion) {
      return (
        <Container style={styles.container} >
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('ConsultarPerfilGenerico')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Modificar perfil</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.handleSubmit}>
                <Text>Guardar</Text>
              </Button>
            </Right>
          </Header>

          <Content>
            <Form>
              <Item onPress={this.addImagen}>
                <Thumbnail large center source={{ uri: this.state.new_avatar ? this.state.avatar_url : this.state.organizacion.avatar.url }} />
                {this.state.uploadingImage ? <Spinner /> : undefined}
              </Item>
              
              <ListItem>
                <Label style={styles.label}>Nombre</Label>
                <Text>{this.state.organizacion.nombre}</Text>
              </ListItem>

              <Item floatingLabel>
                <Label>Descripción</Label>
                <Input
                  value={this.state.organizacion.descripcion !== null ? this.state.organizacion.descripcion.toString() : ""}
                  onChangeText={text => this.handleChange('descripcion', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.descripcion}</Text>

              <Item floatingLabel>
                <Label>Teléfono</Label>
                <Input
                  value={this.state.organizacion.telefono !== null ? this.state.organizacion.telefono.toString() : ""}
                  onChangeText={text => this.handleChange('telefono', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.telefono}</Text>

              <Item floatingLabel>
                <Label>CUIT</Label>
                <Input
                  value={this.state.organizacion.cuit !== null ? this.state.organizacion.cuit.toString() : ""}
                  onChangeText={text => this.handleChange('cuit', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.cuit}</Text>

              <ListItem>
                <Label>Rubro</Label>
                <Picker
                  selectedValue={this.state.organizacion.rubro !== null ? this.state.organizacion.rubro.id : ""}
                  onValueChange={(itemValue) => this.handleChangeRubro(itemValue)}>
                  <Picker.Item label="" value="" />
                  {this.getRubros()}
                </Picker>
              </ListItem>
              <Text style={styles.validationMessage}>{this.state.errors.rubro}</Text>
            </Form>
          </Content>
        </Container>
      );
    }
    return (<Text></Text>)
  }
}

export default ModificarPerfilOrganizacion;