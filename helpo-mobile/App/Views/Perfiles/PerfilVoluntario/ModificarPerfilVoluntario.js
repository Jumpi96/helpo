import React, { Component } from 'react';
import api from '../../../api'
import { uploadImage } from '../../../Lib/Imagen'
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
  TextInput,
  Picker,
  Thumbnail,
  Separator,
} from 'native-base';
import styles from './styles'

class ModificarPerfilVoluntario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voluntario: undefined,
      errors: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSexo = this.handleChangeSexo.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addImagen = this.addImagen.bind(this);
  }

  async addImagen() {
    // Llamo al imagePicker y hago todo el procesamiento de cargar una imagen
    //Options for the image picker
    const options = {
      title: 'Seleccionar Imagen',
    };
    ImagePicker.showImagePicker(options, async (response) => {
      // Paso la data de la imagen a Imagen para subirla a imgur
      const url = await handleImageUpload(response.data)
      this.props.uploadImagen(url, this.props.eventoId)
    })
  }

  componentDidMount() {
    let voluntario = {};
    api.get('/auth/user/')
      .then(res => {
        voluntario.nombre = res.data.nombre;
        voluntario.apellido = res.data.apellido;
        return api.get(`/perfiles/perfil_voluntario/${res.data.id}/`)
      })
      .then(res => {
        this.setState({
          voluntario: Object.assign(voluntario, res.data)
        });
        console.warn()
      });
  }

  handleChange(item, text) {
    const { voluntario } = this.state;
    voluntario[item] = text;
    this.setState({ voluntario });
  }

  handleChangeSexo(value) {
    const { voluntario } = this.state;
    voluntario.sexo = value;
    this.setState({ voluntario });
  }

  handleSubmit() {
    const { voluntario } = this.state;
    if (this.handleValidation()) {
      api.put('perfiles/perfil_voluntario/' + voluntario.usuario.id + '/', voluntario)
        .then((res) => {
          this.props.navigation.navigate('ConsultarPerfilGenerico');
        })
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;
    const { voluntario } = this.state;

    if (Number.isNaN(voluntario.dni)) {
      formIsValid = false;
      errors.dni = 'Debe ingresar un DNI válido.';
    } else { errors.dni = undefined; }

    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    if (this.state.voluntario) {
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
                <Thumbnail large center source={{uri: this.state.voluntario.avatar.url}} />
              </Item>
              <Separator bordered noTopBorder>
                <Text>Datos personales</Text>
              </Separator>

              <ListItem>
                <Label style={styles.label}>Nombre</Label>
                <Text>{this.state.voluntario.nombre}</Text>
              </ListItem>

              <ListItem>
                <Label style={styles.label}>Apellido</Label>
                <Text>{this.state.voluntario.apellido}</Text>
              </ListItem>

              <Item floatingLabel>
                <Label>Teléfono</Label>
                <Input
                  value={this.state.voluntario.telefono !== null ? this.state.voluntario.telefono.toString() : ""}
                  onChangeText={text => this.handleChange('telefono', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.telefono}</Text>

              <Item floatingLabel>
                <Label>DNI</Label>
                <Input
                  value={this.state.voluntario.dni !== null ? this.state.voluntario.dni.toString() : ""}
                  onChangeText={text => this.handleChange('dni', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.dni}</Text>

              <ListItem>
                <Label>Sexo</Label>

                <Picker
                  selectedValue={this.state.voluntario.sexo}
                  onValueChange={(itemValue) => this.handleChangeSexo(itemValue)}>
                  <Picker.Item label="" value="" />
                  <Picker.Item label="Hombre" value="Hombre" />
                  <Picker.Item label="Mujer" value="Mujer" />
                  <Picker.Item label="Otro" value="Otro" />
                </Picker>
              </ListItem>
              <Text style={styles.validationMessage}>{this.state.errors.sexo}</Text>

              <Separator bordered noTopBorder>
                <Text>Extras</Text>
              </Separator>

              <Item floatingLabel>
                <Label>Gustos</Label>
                <Input
                  value={this.state.voluntario.gustos}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={text => this.handleChange('gustos', text)}
                />
              </Item>
              <Text style={styles.validationMessage}>{this.state.errors.gustos}</Text>

              <Item floatingLabel>
                <Label>Habilidades</Label>
                <Input
                  multiline={true}
                  numberOfLines={5}
                  onChange={text => this.handleChange('habilidades', text)}
                  value={this.state.voluntario.habilidades}
                />
              </Item>
            </Form>
          </Content>
        </Container>
      );
    }
    return (<Text></Text>)
  }
}

export default ModificarPerfilVoluntario;