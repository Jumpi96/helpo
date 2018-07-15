import React from "react";
import { Alert } from "react-native";
import { FormValidationMessage } from "react-native-elements";
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
  Text
} from "native-base";
import SelectorUbicacion from "./SelectorUbicacion/SelectorUbicacion"; //Preguntas si hace falta copiar y pegar el selecctor siempre o referenciarlomediante la rua en donde esta creado
import ListaRubrosOrganizacion from "./ListaRubrosOrganizacion/ListaRubrosOrganizacion";
import api from "../../../../api";
import moment from "moment";
import styles from "./styles";
import ListaRubrosOrganizacion from "../../../../../helpo-web/src/views/Perfiles/ListaRubrosOrganizacion/ListaRubrosOrganizaciones";


class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
    nombre: 'organizacion',
    cuit: '',
    ubicacion: { latitud: 0, longitud: 0, notas:'#!None#!'},
    mail: '',
    telefono: '',
    rubro: { id: 0, nombre: "none"},
    avatar_url: 'assets/user.png',
    descripcion: '',
    errors: {},
    };

    this.guardar = this.guardar.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);

  }

  componentDidMount() {
    api.get(`/perfiles/perfil_organizacion/${this.props.usuarioId}`)
    .then( (res) => {
      let rubro = res.rubro
      let ubicacion = res.ubicacion
      if ( rubro == null ) {
        rubro = { id: 0, nombre: 'none'}
      }
      if ( ubicacion == null ) {
        ubicacion = { latitud: 0, longitud: 0, notas:'#!None#!'}
      }
      this.setState({
        cuit: res.cuit,
        telefono: res.telefono,
        descripcion: res.descripcion,
        rubro_id: rubro.id,
        rubro_nombre: rubro.nombre,
        avatar_url: res.avatar.url,        
      })
    })
  }  

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }

  handleUbicacionChange(ubi) {
    this.setState({ ubicacion: ubi });
  }

  guardar(){
    event.preventDefault();
    if (this.handleValidation()) {
      
      const perfil = {};
        perfil.nombre = this.state.nombre;

        if(this.state.rubro.id != 0){
          perfil.rubro_id = this.state.rubro_id;
        }
        if(this.state.ubicacion.latitud != 0){
          perfil.ubicacion = this.state.ubicacion;
        }        
        perfil.cuit =  this.state.cuit;
        perfil.mail =  this.state.mail;
        perfil.telefono =  this.state.telefono;
        perfil.avatar_url = this.state.avatar_url;
        perfil.descripcion =  this.state.descripcion;
     
      api.put(`/perfiles/perfil_organizacion/${this.props.usuarioId}`, perfil)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.props.history.push('dashboard'); //Fijarse que pasa con la ruta
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
        });
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    } else { errors.nombre = undefined; }

    {/* if (!this.state.cuit) {
      formIsValid = false;
      errors.cuit = 'Debe ingresar un cuit.';
    } else { errors.cuit = undefined; }

    if (!this.state.telefono) {
      formIsValid = false;
      errors.telefono = 'Debe ingresar un teléfono.';
    } else { errors.telefono = undefined; }
    */}

    if (this.state.rubro.id === 0) { //Revisar cuando se cambie la lista de rubros
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar el rubro.';
    } else { errors.rubro = undefined; }

    this.setState({ errors });
    return formIsValid;
  }
  
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Modificar perfil</Title>
          </Body>
          <Right />
        </Header>   

        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Nombre</Label>
              <Input 
                value={this.state.nombre}
                onChangeText={(text) => this.setState({ nombre: text })} 
              />
            </Item>
            <FormValidationMessage>{this.state.errors.nombre}</FormValidationMessage>
            
            <PhotoUpload> // de aca hay que ver como implementar el componente https://github.com/malsapp/react-native-photo-upload
             <Image
              source={{
              uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
              }}
             />
            </PhotoUpload>
            
            <Item floatingLabel>
              <Label>Mail</Label>
              <Input 
                value={this.state.mail}
                onChangeText={(text) => this.setState({ mail: text })} 
              />
            </Item>
            <FormValidationMessage>{this.state.errors.mail}</FormValidationMessage>

            <Item floatingLabel>
              <Label>Teléfono</Label>
              <Input 
                value={this.state.telefono}
                onChangeText={(text) => this.setState({ telefono: text })} 
              />
            </Item>
            <FormValidationMessage>{this.state.errors.telefono}</FormValidationMessage>

            <Item floatingLabel>
              <Label>CUIT</Label>
              <Input 
                value={this.state.cuit}
                onChangeText={(text) => this.setState({ cuit: text })} 
              />
            </Item>
            <FormValidationMessage>{this.state.errors.cuit}</FormValidationMessage>



            <ListaRubrosOrganizacion
              name="listaRubros"
              rubro_id={this.state.rubro.id}
              onRubroChange={this.handleRubroChange} />
            <FormValidationMessage>{this.state.errors.rubro}</FormValidationMessage>


            <Item>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}
                onUbicacionChange={this.handleUbicacionChange} />
            </Item>

            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input value={this.state.descripcion}
                onChangeText={(text) => this.setState({ descripcion: text })} />
            </Item>
            

            <Button block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit} >
              <Text>Guardar perfil</Text>
            </Button>

          </Form>
        </Content>

      </Container>
    );
  }
}

export default RegistrarEvento;